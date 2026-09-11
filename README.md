[![Ruby tests](https://github.com/theforeman/foreman_rh_cloud/actions/workflows/ruby_tests.yml/badge.svg)](https://github.com/theforeman/foreman_rh_cloud/actions/workflows/ruby_tests.yml)
[![JS](https://github.com/theforeman/foreman_rh_cloud/actions/workflows/js_tests.yml/badge.svg)](https://github.com/theforeman/foreman_rh_cloud/actions/workflows/js_tests.yml)
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/theforeman/foreman_rh_cloud)

# ForemanRhCloud

A [Foreman](https://theforeman.org/) plugin that connects your Foreman or Red Hat Satellite instance to the [Red Hat Hybrid Cloud Console](https://cloud.redhat.com). It provides:

- **Inventory Upload** — Generate and upload host inventory reports to Red Hat cloud
- **Insights Recommendations** — Sync security, performance, and stability recommendations from Red Hat Insights
- **Remediations** — Apply Insights remediation playbooks via Remote Execution (Ansible)
- **Cloud Connector** — Enable cloud-initiated remediations through `rhcd`
- **Client Tools Forwarding** — Proxy `insights-client` requests from managed hosts

## Requirements

- Foreman (with the following plugins):
  - [Katello](https://github.com/Katello/katello)
  - [foreman_ansible](https://github.com/theforeman/foreman_ansible)
  - [foreman-tasks](https://github.com/theforeman/foreman-tasks)
  - [foreman_remote_execution](https://github.com/theforeman/foreman_remote_execution)
- Ruby >= 2.7, < 4

## Installation

See [How to Install a Plugin](https://projects.theforeman.org/projects/foreman/wiki/How_to_Install_a_Plugin) in the Foreman wiki.

## Operating Modes

The plugin operates in two modes:

### Regular Mode (Cloud)

The default mode. Communicates directly with Red Hat cloud services to upload inventory, download recommendations, and forward client requests.

### IoP Mode (On-Premise)

When an IoP Smart Proxy is configured, all cloud communication is routed through the local proxy instead. HTTP proxy settings are disabled, and scheduled sync tasks are skipped. Note: "IoP" is a technical abbreviation used internally but does not officially stand for anything.

Check the current mode: `ForemanRhCloud.with_iop_smart_proxy?`

## Usage

### Inventory Upload

**UI (cloud):** Insights → Inventory Upload → select the organization → Generate and upload report
**UI (IoP):** Administer → Inventory Upload → select the organization → Generate and upload report

**CLI:**

```bash
# Generate and upload report for all organizations
foreman-rake rh_cloud_inventory:report:generate_upload

# Generate and upload report for specific organization
foreman-rake rh_cloud_inventory:report:generate_upload organization_id=1

# Generate report without uploading
foreman-rake rh_cloud_inventory:report:generate organization_id=1 target=/var/lib/foreman/red_hat_inventory/generated_reports/

# Upload a previously generated report
foreman-rake rh_cloud_inventory:report:upload organization_id=1 target=/var/lib/foreman/red_hat_inventory/generated_reports/
```

### Insights Recommendations

**UI:** Insights → Recommendations → Sync recommendations (under the vertical ellipsis menu)

**CLI:**

```bash
foreman-rake rh_cloud_insights:sync
```

### Inventory Status Sync

**UI:** Insights → Inventory Upload → Sync all inventory status

**CLI:**

```bash
# All organizations
foreman-rake rh_cloud_inventory:sync

# Specific organization
foreman-rake rh_cloud_inventory:sync organization_id=1
```

## Cloud Endpoints

| Purpose | Default URL | ENV Override |
|---|---|---|
| Inventory uploads | `https://cert.cloud.redhat.com/api/ingress/v1/upload` | `SATELLITE_INVENTORY_UPLOAD_URL` |
| Query inventory hosts | `https://cloud.redhat.com/api/inventory/v1/hosts` | `SATELLITE_RH_CLOUD_URL` |
| Query Insights hits | `https://cloud.redhat.com/api/insights/v1/export/hits/` | `SATELLITE_RH_CLOUD_URL` |
| Query Insights rules | `https://cloud.redhat.com/api/insights/v1/rule/` | `SATELLITE_RH_CLOUD_URL` |
| Query remediations | `https://cloud.redhat.com/api/remediations/v1/resolutions` | `SATELLITE_RH_CLOUD_URL` |
| Forward `/platform` requests | `https://cert.cloud.redhat.com/api` | `SATELLITE_CERT_RH_CLOUD_URL` |
| Forward `/lightspeed` requests | `https://cert.cloud.redhat.com/api/lightspeed` | `SATELLITE_CERT_RH_CLOUD_URL` |
| Forward legacy `/redhat_access/r/insights` | `https://cert-api.access.redhat.com/r/insights` | `SATELLITE_LEGACY_INSIGHTS_URL` |

## Development

> **Important:** foreman_rh_cloud is a Foreman plugin, not a standalone app. Edit files in this directory but run all `rake`/`rails` commands from the **Foreman root** directory.

### Setup

```bash
# Clone Foreman and this plugin (if not already done)
cd /path/to/foreman

# Install Ruby dependencies
bundle install

# Install JavaScript dependencies (from the plugin directory)
cd /path/to/foreman_rh_cloud
npm install
```

### Running Tests

**Ruby tests** (from the Foreman directory):

```bash
cd /path/to/foreman

# Run all plugin tests
bundle exec rake test:foreman_rh_cloud

# Run a single test file
bundle exec rake test TEST=/path/to/foreman_rh_cloud/test/path/to/test_file.rb
```

**JavaScript tests** (from the plugin directory):

```bash
cd /path/to/foreman_rh_cloud

npm test                # All JS tests
npm run test:watch      # Watch mode
npm run test:current    # Current changes only
```

### Linting

```bash
# Ruby (from Foreman directory)
cd /path/to/foreman
bundle exec rubocop --parallel

# JavaScript (from plugin directory)
cd /path/to/foreman_rh_cloud
npm run lint
```

### Development Server

```bash
cd /path/to/foreman
bundle exec foreman start
```

## Architecture

See [ARCHITECTURE.md](ARCHITECTURE.md) for detailed design documentation covering code organization, report generation flow, recommendations sync, Cloud Connector, and client tools forwarding.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run the full test suite and linter (see above)
5. Submit a Pull Request

## Copyright

Copyright (c) 2013 - 2026 The Foreman Team

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program. If not, see <http://www.gnu.org/licenses/>.
