# Architecture

This plugin is intended to connect a Foreman instance to the Red
Hat Hybrid Cloud Console.
Currently it deals with the following aspects:

* Inventory reports
* Recommendations and remediations synchronization
* Cloud side initiated remediations
* Handling of client tools requests from the managed hosts

Server side is built as a Rails engine + React pages that
show objects that are specific for the plugin, like
recommendations. In addition to these there are React
components that are integrated into existing foreman pages,
like hosts index and details pages by using the slot and
fill mechanism.

The plugin is based on asynchronous communication with the
cloud that is done either automatically once a day or
initiated manually from the plugin's UI.

## Code structure

As a rule of thumb, the code is divided into namespaces for
each aspect of the plugin. This comes on top of the common
Rails directory structure: `app/{models,controllers,views}`
e.t.c.

The `lib/` folder contains code that is not related to any
specific Rails object. It is also namespaced, and each
namespace contains folders according the purpose of the
code. The most common case is `lib/{ns}/async` folder that
will contain asynchronous tasks that are needed for that
aspect. Additionally there is `lib/{ns}/generators` folder
that contains classes that are responsible for generating
new artifacts, like reports and messages that are sent to
the cloud. Most constants and configurable settings are
stored in the `lib/{namespace}.rb` file.

The client side is a set of React components that are
following the same files layout:

```
webpack
├── InsightsCloudSync
│   ├── Components
│   │   ├── InternalComponent
│   │   │   └── the-same-structure-as-parent
│   ├── index.js
│   ├── InsightsCloudSyncActions.js
│   ├── InsightsCloudSyncConstants.js
│   ├── InsightsCloudSyncHelpers.js
│   ├── InsightsCloudSync.js
│   ├── InsightsCloudSyncReducers.js
│   ├── InsightsCloudSync.scss
│   ├── InsightsCloudSync.test.js
```

- `{component}Actions.js` contains the functions used by
the component.
- `{component}Constants.js` contains the constants for the
component
- `{component}Helpers.js` contains redux accessors and URI
generator methods
- `{component}.js` main code of the component
- `{component}Reducers.js` contains the reducers that
handle the global redux state.
- `{component}.scss` styling for the component
- `{component}.test.js` tests

## Inventory reports

The idea is to generate a report from Foreman's inventory.
Hosts that will be included are those that have a
subscription attached to them. Additionally we want to
indicate for each host whether it was reported to the cloud
or not. The reporter can be either this plugin, or any
other reporting tool e.g. `insights-client`.

### Report generation

The code under the hood is based on a set of actions that
are scheduled one after another:

1. Generate report - this action generates a report that
consists of a metadata file and a set of slices. A
**metadata** file is a file that contains general
information about the report like the names of the
slices and some metadata about the reporting machine. A
**slice** is a file that contains information about an
array of hosts. The files are formatted as json and then
archived into `tar.xz` container. The naming of the
container would be `report_for_{org_id}.tar.xz`.
2. Queue the report - this action copies the generated file
into a folder that will be used to upload the report.
3. Upload the report - this task uses the `uploader.sh`
script to upload the report to the Red Hat cloud. Once the
report is uploaded, it is moved to the `done` folder. The
idea of the script is that the queue and the script could
be copied to an external drive on a disconnected
environment and then executed from a machine that does have
a connection to the internet.

### Inventory status sync

The code consists of a task that is responsible to download
all hosts that belong to a specific Foreman instance and
then corellate the hosts to Foreman host records. The
corellation is done by comparing the subscription UUID from
the cloud record to the one in the database. This task also
is responsible to generate a list of hosts that exist in
the cloud results, but do not exist in the local database.
Those hosts would be recorded to a separate table, where an
option to remove those records from the cloud would be
available.

## Recommendations and remediations

### Synchronization process

This part is responsible to get recommendations data from
the cloud and present it on Foreman native pages. It
introduces two new objects: **rule** - a set of conditions
that describe a problem and **recommendation** - an
indicator that a rule is applicable to a specific host.

First, the process syncs host records from the cloud,
similar to what happens in the inventory status sync. Then
the process downloads the recommendations and rule
definitions from the cloud into its own tables, adds a
recommendations count column on the hosts list page and
recommendations tab on host details page. Additionally
there is a way to see the whole recommendations table on a
separate page in the UI.

The synchronization is done by the following tasks:
1. Recommendations sync task: hits the cloud API and
creates the recommendations record.
2. Rules sync task: hits the cloud API and creates rule
record that will be available to all recommendations for
the same rule.

### Foreman initiated remediation

Once the records were synced, there is an option to
remediate selected recommendations by running an ansible
playbook. Once the user selects which recommendations are
selected for remediation, a new Remote Execution Job is
instantiated. This REX job is based on a specific feature
and a template that comes with it. The template uses a
single helper method that accepts the remediation ids list,
downloads the playbook that will contain the selected
remediations and outputs the resulting playbook. The
downloaded playbook is passed then to the template and fed
into the REX job. From this step it's handled by the REX
plugin.

### Cloud initiated remediation (Cloud connector)

Another option to run remediations is to do it from the
cloud UI. The idea is to put a special "listener" on the
Foreman machine that will listen to event generated by the
cloud and once the cloud emits a remediation event, it will
notify Foreman to start the remediation process.

In order for this to work a couple of changes are
needed on the Foreman server machine:
1. A new service is needed to be installed: `rhcd`
2. A new worker is needed to be installed:
`yggdrasil-worker-forwarder`
3. The worker needs to be registered properly in the rhcd
and configured to be able to access the Foreman server.
4. The rhcd instance needs to be registered in the
`Sources` cloud registry as a valid listener.

This configuration process is initiated by the "Configure
cloud connector" button in the UI, and is implemented as a
REX job and a subscriber task. The REX job is initiated
with a specific feature, and executes a playbook from
`foreman-operations` collection. One of the steps in the
task is a request to Foreman server to persist the rhcd id.
The subscriber task waits for this task to finish and then
using the rhcd id from the REX job, it calls the Sources
API to properly subscribe the new rhcd instance.

Once the configuration phase is finished the remediation
request will be able to flow from the cloud, through the
worker and hit a new API on the Foreman server.
The API in turn will examine the request, extract the
playbook id from it and initiate a REX job with that id.
The job also has a specific feature and a template. Similar
to the Foreman initiated use case, the template calls a
dedicated helper method, that hits a cloud API to download
the actual playbook and then passes the playbook to the REX
framework through the template.

## Client tools requests forwarding

This part is mostly about the `insights-client` tool, but
it can be extended for any other tool that runs on the
client machine. The motivation behind this feature is that
often the hosts do not have direct access to the internet,
and the only server that does have such access is the
Foreman machine itself.

This is achieved by exposing a path that will be directed
to a specific class, called **forwarder**. Its job is to
decide which cloud endpoint should be used for the specific
received request, and what is the proper request settings
to initiate the request (for example the forwarder would
consider Foreman proxy settings and will use proper
security).

The controller action is authenticated by inheriting
Katello's client authentication mechanism, or in other
words, it uses a certificate issued by Katello. Once the
connection is established, the controller will check for a
valid subscription uuid.

After the authentication, the `CloudRequestForwarder` class
is called that performs the actual forwarding. The class
inspects the original request, and issues another request
using the rules hard-coded into the the class. As part of
the forwarding workflow, the authentication scheme may be
changed (in case the request actually requires it), and
then a certificate that is stored in the manifest
associated with the relevant organization will be used for
mTLS.

In addition there is another host status that leverages the
fact that all insights-client communication is routed
through the Foreman server, and it enables to observe when
was the last time the host actually sent information to the
cloud. This **insights status** will be green as long as
there was an upload in the last 3 days, and will become
obsolete once the interval is passed. This is acieved by
yet another scheduled task that runs once a day and decides
which statuses are considered stale, and forces
recalculation of those statuses.
