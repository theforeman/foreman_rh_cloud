# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## CRITICAL: Plugin Architecture & Commands

**foreman_rh_cloud operates as a plugin to Foreman core, not as a standalone application.**

### Essential Rules:
- **All `rake` and `rails` commands must be run from Foreman directory** (`$GITDIR/foreman` or `/home/vagrant/foreman`)
- **Commands must use `bundle exec` prefix** to ensure correct gem versions
- **Edit files in this directory** (`/home/vagrant/foreman_rh_cloud`)
- **Run commands from Foreman directory** (`/home/vagrant/foreman`)

### Key Command Pattern:
```bash
# Edit files here: /home/vagrant/foreman_rh_cloud
# Run commands here: /home/vagrant/foreman
cd $GITDIR/foreman
bundle exec [command]
```

## Project Overview

This is a Foreman plugin that connects a Foreman/Satellite instance to the Red Hat Hybrid Cloud Console. It handles:
- Inventory report generation and upload
- Recommendations and remediations synchronization from Red Hat Insights
- Cloud-initiated remediations via Cloud Connector
- Client tools request forwarding (e.g., insights-client)

This is a Rails engine plugin with React frontend components.

**Operating Modes**: The plugin operates in two distinct modes:
1. **Regular Mode** - Syncs with Red Hat cloud services (cloud.redhat.com)
2. **IoP Mode** - Uses local Insights on Premise (IoP) Smart Proxy instead of cloud services

Check mode with: `ForemanRhCloud.with_iop_smart_proxy?`

## Quick Reference

### Testing Commands

**From `/home/vagrant/foreman`:**

```bash
# Run all tests for this plugin
bundle exec rake test:foreman_rh_cloud

# Run specific test file - use full path
bundle exec rake test TEST=/home/vagrant/foreman_rh_cloud/test/path/to/test_file.rb

# Run linting
bundle exec rubocop --parallel

# Auto-fix Ruby issues
bundle exec rubocop -a
```

### JavaScript Testing

**From `/home/vagrant/foreman_rh_cloud`:**

```bash
npm test                    # All JS tests
npm run test:watch          # Watch mode
npm run test:current        # Current changes only
npm run lint                # Lint JS code
```

### Development Server

**From `/home/vagrant/foreman`:**

```bash
bundle exec foreman start   # Start development server
bundle exec rake console    # Rails console
```

### Common Rake Tasks

**From `/home/vagrant/foreman`:**

```bash
# Generate and upload inventory report for all organizations
bundle exec rake rh_cloud_inventory:report:generate_upload

# Generate and upload for specific organization
organization_id=1 bundle exec rake rh_cloud_inventory:report:generate_upload

# Generate report without uploading
organization_id=1 target=/var/lib/foreman/red_hat_inventory/generated_reports/ \
  bundle exec rake rh_cloud_inventory:report:generate

# Sync recommendations from Insights
bundle exec rake rh_cloud_insights:sync

# Sync inventory status
bundle exec rake rh_cloud_inventory:sync
```

## IoP Mode vs Regular Mode

The plugin has two distinct operating modes based on whether an IoP (Insights on Premise) Smart Proxy is configured.

**Check current mode:** `ForemanRhCloud.with_iop_smart_proxy?` (returns true if IoP Smart Proxy exists)

### Regular Mode (Cloud)
- Syncs with Red Hat cloud services (cloud.redhat.com, cert.cloud.redhat.com)
- Uploads inventory reports to cloud
- Downloads recommendations from cloud APIs
- Forwards client requests to cloud endpoints
- Uses HTTP proxy settings from Foreman configuration
- Scheduled sync tasks run daily

### IoP Mode (On-Premise)
- Uses local IoP Smart Proxy services instead of cloud
- All URLs point to local IoP Smart Proxy (`ForemanRhCloud.iop_smart_proxy.url`)
- Request forwarding goes to local services, not cloud
- HTTP proxy is disabled (empty string)
- Scheduled sync tasks are disabled (output status message instead)
- Inventory sync skipped (uses subscription manager IDs instead)
- VMaaS repository scan syncs with local IoP services

**Key behavioral differences in IoP mode:**
- `ForemanRhCloud.on_premise_url` returns IoP Smart Proxy URL
- `ForemanRhCloud.proxy_string` returns empty string
- `InsightsScheduledSync` and `InventoryScheduledSync` skip execution
- `CloudRequestForwarder` includes IoP CA certificate
- Vulnerability features enabled in API responses

**Relevant files:**
- `lib/foreman_rh_cloud.rb:6-13` - URL resolution logic
- `lib/foreman_rh_cloud/engine.rb:121-128` - IoP Smart Proxy detection
- `app/controllers/concerns/foreman_rh_cloud/iop_smart_proxy_access.rb` - Controller helpers

## Architecture

### Code Organization

The codebase is divided into **namespaces** for each major feature area:

1. **ForemanInventoryUpload** - Inventory report generation and upload
2. **InsightsCloud** - Recommendations/remediations sync and client tools forwarding
3. **InventorySync** - Inventory status synchronization
4. **ForemanRhCloud** - Core engine and shared functionality

Each namespace follows Rails directory structure (`app/{models,controllers,views}`) plus:
- `lib/{namespace}/async/` - Asynchronous Dynflow tasks
- `lib/{namespace}/generators/` - Report and message generators
- `lib/{namespace}.rb` - Constants and configurable settings

### Backend Architecture

**Asynchronous tasks** are the core of this plugin:
- All cloud communication happens asynchronously via Dynflow
- Tasks are scheduled automatically (daily) or triggered manually from UI
- Four main scheduled tasks (registered in `lib/foreman_rh_cloud/engine.rb`):
  - `ForemanInventoryUpload::Async::GenerateAllReportsJob` - Daily report generation
  - `InventorySync::Async::InventoryScheduledSync` - Daily inventory sync
  - `InsightsCloud::Async::InsightsScheduledSync` - Daily recommendations sync
  - `InsightsCloud::Async::InsightsClientStatusAging` - Daily status cleanup

**Key models:**
- `InsightsRule` - Problem definitions from Red Hat Insights
- `InsightsHit` - Recommendations (rule applied to specific host)
- `InsightsResolution` - Remediation playbooks
- `InsightsFacet` - Host extension for Insights data
- `InsightsClientReportStatus` - Host status tracking last insights-client upload
- `InventorySync::InventoryStatus` - Host cloud sync status
- `InsightsMissingHost` - Tracks hosts in cloud but not in Foreman

**Controllers:**
- `/api/rh_cloud/inventory/*` - Inventory operations API
- `/api/rh_cloud/cloud_request/*` - Client tools request forwarding
- `/insights_cloud/*` - Insights UI and sync operations
- `/foreman_inventory_upload/*` - Inventory upload UI

### Frontend Architecture

React components in `webpack/` follow this pattern:

```
ComponentName/
├── Components/           # Child components
├── index.js              # Entry point
├── ComponentName.js      # Main component code
├── ComponentNameActions.js     # Redux actions
├── ComponentNameConstants.js   # Constants
├── ComponentNameHelpers.js     # Redux selectors and URI generators
├── ComponentNameReducers.js    # Redux reducers
├── ComponentName.scss          # Styles
└── ComponentName.test.js       # Tests
```

Key UI components:
- **ForemanInventoryUpload** - Inventory upload dashboard and settings
- **InsightsCloudSync** - Recommendations sync UI
- **CVEsHostDetailsTab** - CVE information on host details pages

Components integrate into existing Foreman pages using the **slot and fill** mechanism.

### UI Development Guidelines

**For new table-based pages, use TableIndexPage from Foreman:**

```javascript
import TableIndexPage from 'foremanReact/components/PF4/TableIndexPage/TableIndexPage';

const columns = {
  name: {
    title: __('Name'),
    wrapper: ({id, name}) => <a href={`/path/${id}`}>{name}</a>,
    isSorted: true
  },
  status: { title: __('Status') },
};

return (
  <TableIndexPage
    apiUrl="/katello/api/resources"
    apiOptions={{ key: 'RESOURCE_KEY' }}
    header={__('Resources')}
    controller="resources"
    columns={columns}
  />
);
```

**UI Best Practices:**
- Use Patternfly components for consistency
- Follow existing patterns in `webpack/` directory
- Write tests alongside components in `__tests__/` subdirectories
- Redux is used for storing API responses
- Leverage Foreman's API helpers and hooks

### Report Generation Flow

1. **Generate** - Creates metadata + slice files (JSON), archives to `tar.xz`
2. **Queue** - Copies report to upload folder
3. **Upload** - Uses `uploader.sh` script to send to Red Hat cloud
4. Reports are named `report_for_{org_id}.tar.xz`

### Recommendations Flow

1. **Sync hosts** - Download host records from cloud API
2. **Sync recommendations** - Download hits (recommendations per host)
3. **Sync rules** - Download rule definitions
4. **Display** - Show on hosts list, host details, and dedicated recommendations page
5. **Remediate** - Generate REX job with Ansible playbook from cloud

### Cloud Connector (Cloud-Initiated Remediations)

Requires setup on Foreman server:
- `rhcd` service (listener)
- `yggdrasil-worker-forwarder` (worker)
- Registration in Red Hat Sources registry

Flow: Cloud UI → rhcd → worker → Foreman API → REX job → playbook execution

### Client Tools Forwarding

`CloudRequestForwarder` class forwards insights-client requests through Foreman to cloud:
- Hosts without internet access use Foreman as proxy
- Uses Katello client certificate authentication
- Transforms request settings (auth scheme, proxy, SSL)
- Enables tracking last upload time via `InsightsClientReportStatus`

## Testing

**Important**: All backend tests use Dynflow testing helpers. When writing new action tests, follow the pattern in existing test files under `test/jobs/`.

### Test Organization
- `test/controllers/` - Controller tests
- `test/jobs/` - Async Dynflow action tests
- `test/models/` - Model tests
- `test/unit/` - Service and utility tests
- `webpack/**/__tests__/` - React component tests

### Test Best Practices
- Write tests before implementation (TDD)
- Follow existing Dynflow test patterns for async actions
- Test both Regular and IoP mode behaviors when applicable
- Run full test suite before submitting PRs: `cd $GITDIR/foreman && bundle exec rake test:foreman_rh_cloud`

## Troubleshooting

### Wrong Directory Errors
**Symptoms**: "No Rakefile found", gem version conflicts
**Solution**: Always run commands from Foreman directory:
```bash
cd $GITDIR/foreman  # or cd /home/vagrant/foreman
bundle exec [command]
```

### Bundle/Gem Issues
**Symptoms**: "Could not find gem", version conflicts
**Solution**:
```bash
cd $GITDIR/foreman
bundle install
bundle exec [command]
```

### Test Failures
**Symptoms**: Database errors, setup failures
**Solution**:
```bash
cd $GITDIR/foreman
bundle exec rake db:test:prepare
```

### JavaScript/Asset Issues
**Symptoms**: UI not updating, build errors
**Solution**:
```bash
# JavaScript issues (from foreman_rh_cloud directory)
cd $GITDIR/foreman_rh_cloud
npm install

# Rails assets (from Foreman directory)
cd $GITDIR/foreman
bundle exec rake assets:precompile
```

## Cloud Endpoints

The plugin connects to these Red Hat cloud services:

| Purpose | Default URL | ENV Override |
|---------|-------------|--------------|
| Inventory uploads | https://cert.cloud.redhat.com/api/ingress/v1/upload | SATELLITE_INVENTORY_UPLOAD_URL |
| Query inventory hosts | https://cloud.redhat.com/api/inventory/v1/hosts | SATELLITE_RH_CLOUD_URL |
| Query insights hits | https://cloud.redhat.com/api/insights/v1/export/hits/ | SATELLITE_RH_CLOUD_URL |
| Query insights rules | https://cloud.redhat.com/api/insights/v1/rule/ | SATELLITE_RH_CLOUD_URL |
| Forward insights-client requests | https://cloud.redhat.com/api/static | SATELLITE_RH_CLOUD_URL |
| Legacy insights-client requests | https://cert-api.access.redhat.com/r/insights | SATELLITE_LEGACY_INSIGHTS_URL |

## Dependencies

Required plugins:
- `katello` - Content management (provides subscription data)
- `foreman_ansible` - Remote execution with Ansible
- `foreman_tasks` - Dynflow task framework

## Katello Overrides & Extensions

**IMPORTANT**: This plugin patches and extends Katello classes. Changes to these Katello components may cause regressions in foreman_rh_cloud.

### Classes Extended/Patched

The plugin modifies Katello behavior in the following locations (defined in `lib/foreman_rh_cloud/engine.rb:38-42,95-111`):

#### 1. **Host Model Extensions** (`::Host::Managed`)
- **File**: `app/models/concerns/rh_cloud_host.rb`
- **Module**: `RhCloudHost`
- **Purpose**: Adds Red Hat Cloud-specific associations to all hosts
- **Changes**:
  - Adds `inventory_upload_facts` association
  - Adds `insights_hits` association through insights facet
  - Adds `insights_client_report_status_object` association
  - Adds `inventory_sync_status_object` association
  - Adds scoped searches for insights recommendations, client report status, inventory sync status, and insights UUID
  - Provides `insights_facet` helper method

#### 2. **Manifest Import Notification** (`Katello::UINotifications::Subscriptions::ManifestImportSuccess`)
- **File**: `lib/foreman_inventory_upload/notifications/manifest_import_success_notification_override.rb`
- **Module**: `ForemanInventoryUpload::Notifications::ManifestImportSuccessNotificationOverride`
- **Purpose**: Adds custom action link to manifest import success notifications
- **Overridden Methods**:
  - `actions` - Overrides parent class method (from `Katello::UINotifications::AbstractNotification:20-22`) to add "Enable inventory upload" link
- **Original Katello File**: `/home/vagrant/katello/app/services/katello/ui_notifications/subscriptions/manifest_import_success.rb`

#### 3. **Package Profile Upload Controller** (`Katello::Api::Rhsm::CandlepinDynflowProxyController`)
- **File**: `app/controllers/concerns/insights_cloud/package_profile_upload_extensions.rb`
- **Module**: `InsightsCloud::PackageProfileUploadExtensions`
- **Purpose**: Triggers inventory report generation when hosts upload package profiles (IoP mode only)
- **Hooks Added**:
  - `after_action :generate_host_report` on `:upload_package_profile` and `:upload_profiles` actions
- **Behavior**: In IoP mode, generates single-host inventory report and creates insights facet if missing
- **Original Katello File**: `/home/vagrant/katello/app/controllers/katello/api/rhsm/candlepin_dynflow_proxy_controller.rb:16-40`
- **Original Actions**: These actions handle client package profile uploads via subscription-manager

#### 4. **Organizations API Controller** (`Katello::Api::V2::OrganizationsController`)
- **File**: `lib/foreman_rh_cloud/engine.rb:95-102`
- **Purpose**: Allows IoP Smart Proxy to access organization APIs for debugging
- **Changes**:
  - Includes `Foreman::Controller::SmartProxyAuth` concern
  - Adds smart proxy authentication filters for `:index` and `:download_debug_certificate` actions
  - Filters allow IoP Smart Proxy feature authentication
- **Original Katello File**: `/home/vagrant/katello/app/controllers/katello/api/v2/organizations_controller.rb`
- **Note**: Callback order patched to ensure `local_find_taxonomy` runs after user initialization

#### 5. **Repositories API Controller** (`Katello::Api::V2::RepositoriesController`)
- **File**: `lib/foreman_rh_cloud/engine.rb:103-110`
- **Purpose**: Allows IoP Smart Proxy to access repository index API
- **Changes**:
  - Includes `Foreman::Controller::SmartProxyAuth` concern
  - Adds smart proxy authentication filter for `:index` action
  - Filters allow IoP Smart Proxy feature authentication
- **Original Katello File**: `/home/vagrant/katello/app/controllers/katello/api/v2/repositories_controller.rb`
- **Note**: Callback order patched to ensure `find_product` runs after user initialization

### Testing Katello Integration

When testing changes that affect Katello integration:
- Verify both patched and original behavior work correctly
- Test with and without IoP mode enabled
- Check that smart proxy authentication works for IoP endpoints
- Ensure manifest import notifications show correct actions
- Verify package profile uploads trigger inventory reports in IoP mode

### Monitoring Katello Changes

**Watch these Katello files for changes that might affect foreman_rh_cloud:**
- `app/services/katello/ui_notifications/abstract_notification.rb` - Parent class for notifications
- `app/services/katello/ui_notifications/subscriptions/manifest_import_success.rb` - Notification class we override
- `app/controllers/katello/api/rhsm/candlepin_dynflow_proxy_controller.rb` - Controller with upload actions we hook into
- `app/controllers/katello/api/v2/organizations_controller.rb` - Controller we patch for smart proxy auth
- `app/controllers/katello/api/v2/repositories_controller.rb` - Controller we patch for smart proxy auth

## Contributing & Pull Requests

**IMPORTANT**: When creating pull requests, target your personal fork, NOT the upstream repository.

### GitHub Workflow:
1. Fork `theforeman/foreman_rh_cloud` to your account (e.g., `yourname/foreman_rh_cloud`)
2. Create feature branch in your fork
3. Make changes and commit
4. **Create PR against your fork** (e.g., `yourname/foreman_rh_cloud`)
5. Do NOT create PRs directly against `theforeman/foreman_rh_cloud`

### Before Submitting PR:
```bash
cd $GITDIR/foreman
bundle exec rake test:foreman_rh_cloud  # Run all tests
bundle exec rubocop --parallel           # Check code style

cd $GITDIR/foreman_rh_cloud
npm test                                 # Run JS tests
npm run lint                             # Check JS style
```

## Important Files

- `lib/foreman_rh_cloud/engine.rb` - Rails engine setup, scheduled task registration, controller patches
- `lib/foreman_rh_cloud.rb` - Core module with URL configuration and proxy settings
- `ARCHITECTURE.md` - Detailed architectural documentation
- `app/services/foreman_rh_cloud/cloud_request_forwarder.rb` - Client request forwarding logic
