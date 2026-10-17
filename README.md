[![Ruby tests](https://github.com/theforeman/foreman_rh_cloud/actions/workflows/ruby_tests.yml/badge.svg)](https://github.com/theforeman/foreman_rh_cloud/actions/workflows/ruby_tests.yml)
[![JS](https://github.com/theforeman/foreman_rh_cloud/actions/workflows/js_tests.yml/badge.svg)](https://github.com/theforeman/foreman_rh_cloud/actions/workflows/js_tests.yml)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/theforeman/foreman_rh_cloud)

# ForemanRhCloud

## Installation

See [How_to_Install_a_Plugin](http://projects.theforeman.org/projects/foreman/wiki/How_to_Install_a_Plugin)
for how to install Foreman plugins

## Project overview
See our [wiki](https://deepwiki.com/theforeman/foreman_rh_cloud)

### In Satellite

#### Inventory upload

In UI: Insights -> Inventory Upload -> select the organization -> Generate and upload report

From command-line:

    # generate and upload report for all organizations
    /usr/sbin/foreman-rake rh_cloud_inventory:report:generate_upload

    # generate and upload report for specific organization
    export organization_id=1
    /usr/sbin/foreman-rake rh_cloud_inventory:report:generate_upload

    # generate report for specific organization (don't upload)
    export organization_id=1
    export target=/var/run/foreman/red_hat_inventory/generated_reports/
    /usr/sbin/foreman-rake rh_cloud_inventory:report:generate

    # upload previously generated report (needs to be named 'report_for_#{organization_id}.tar.gz')
    export organization_id=1
    export target=/var/run/foreman/red_hat_inventory/generated_reports/
    /usr/sbin/foreman-rake rh_cloud_inventory:report:upload

#### Fetch hosts remediation data

In UI: Insights -> Recommendations -> Sync recommendations (under the vertical ellipsis)

From command-line:

    /usr/sbin/foreman-rake rh_cloud_insights:sync

#### Synchronize inventory status

In UI: Insights -> Inventory Upload -> Sync all inventory status

From command-line:

    # all organizations
    /usr/sbin/foreman-rake rh_cloud_inventory:sync

    # specific organization with id 1
    export organization_id=1
    /usr/sbin/foreman-rake rh_cloud_inventory:sync

## TODO

*Todo list here*

## Design

### Endpoints

| purpose                       | url    | ENV setting for the **bold** part
| ------------------------------| -------| -----------
| Inventory uploads             | **https://cert.cloud.redhat.com/api/ingress/v1/upload**    | SATELLITE_INVENTORY_UPLOAD_URL
| Query inventory hosts list    | **https://cloud.redhat.com** /api/inventory/v1/hosts?tags=  | SATELLITE_RH_CLOUD_URL
| Query insights hits           | **https://cloud.redhat.com** /api/insights/v1/export/hits/  | SATELLITE_RH_CLOUD_URL
| Query insights rules          | **https://cloud.redhat.com** /api/insights/v1/rule/?impacting=true&rule_status=enabled&has_playbook=true&limit=&offset=  | SATELLITE_RH_CLOUD_URL
| Query insights resolutions    | **https://cloud.redhat.com** /api/remediations/v1/resolutions| SATELLITE_RH_CLOUD_URL
| Forward insights-client `/static` requests    | **https://cloud.redhat.com** /api/static    | SATELLITE_RH_CLOUD_URL
| Forward insights-client legacy `/platform` requests    | **https://cert.cloud.redhat.com** /api    | SATELLITE_CERT_RH_CLOUD_URL
| Forward insights-client legacy `/redhat_access/r/insights` requests    | **https://cert-api.access.redhat.com** /r/insights    | SATELLITE_LEGACY_INSIGHTS_URL


## Inventory archive storage and upgrade

With Foreman's Active Storage support, inventory archives are stored as private
attachments. Generation uses a temporary local directory; workers exchange the
immutable report ID, not a shared filename. Authorized downloads stream the
attachment. Foreman versions without Active Storage continue using the existing
filesystem workflow automatically; no Kubernetes-specific mode is introduced.
The `report:generate` command still exports the requested local output file.

Apply database migrations and configure the same Foreman storage service on all
web and worker instances first. Standalone Disk remains supported; it still needs
persistent/shared storage where multiple processes require access. An S3 service
removes that filesystem dependency. Allow temporary disk space for the largest
archive when uploading or verifying it.

This is a coordinated upgrade, not a mixed-version rolling deployment: stop web
producers, scheduled inventory work and workers, upgrade every process to the same
plugin version, then allow new report jobs. Old serialized inputs are supported by
new code; old workers cannot execute newly introduced attachment-ID inputs.

Back up the database and legacy `tmp/red_hat_inventory` directories. To preview
and then copy archives in `generated_reports`, `uploads` and `uploads/done`:

```console
foreman-rake rh_cloud_inventory:storage:migrate
APPLY=true foreman-rake rh_cloud_inventory:storage:migrate
```

The importer validates the organization and filename, verifies stored bytes and
retains originals. It does not upload to Red Hat or run the report generator.
Source modification times provide legacy ordering; no historical upload time is
invented. Repeated copies skip the same path/checksum. Failures return non-zero.
Symlinks, unrecognized names, deleted organizations and files changing during
copying are rejected rather than silently discarded.

Before removing originals, stop legacy writers, pause scheduled inventory work,
and drain/resolve all active or paused inventory jobs. Keep the legacy mount
available to old path-based jobs until they finish. Take coordinated database and
attachment-store backups, then preview and explicitly apply cleanup:

```console
foreman-rake rh_cloud_inventory:storage:cleanup
CONFIRM_DRAINED=true APPLY=true foreman-rake rh_cloud_inventory:storage:cleanup
```

Cleanup refuses active/resumable inventory tasks and rechecks the source checksum
and attachment before deleting each original. Missing, changed or corrupt copies
keep their source file. It only handles recognized archives in those three
directories, never recursively removes the directory or unrelated files. Custom
CLI exports outside those directories are not imported or deleted.
An exclusive PostgreSQL advisory lock coordinates cleanup with this version's
legacy generators, movers, uploads and CLI exports. Old/unmanaged writers do not
take that lock and must be stopped as described above. If cleanup is interrupted
after unlinking a verified source, rerunning verifies the surviving attachment and
reconciles the missing source before removing its retention protection.

The latest archive per organization/filter and every resumable job are retained.
On later generation, older archives with a stopped owning task are pruned through
Active Storage's attachment lifecycle. Imported archives are protected until their
explicit source cleanup succeeds. Attachment purging uses background jobs, so
workers must remain operational. Historical tasks never fall back to another
task's newer report. Skipped cloud uploads are not recorded as successful uploads.
Downgrading to filesystem-only code after new generation requires restoring a
matching pre-upgrade backup. Do not remove a legacy mount just because a copy task
has completed.

## Contributing

Fork and send a Pull Request. Thanks!

## Copyright

Copyright (c) 2013 - 2024 - The Foreman Team

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
