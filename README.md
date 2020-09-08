# ForemanRhCloud

*Introdction here*

## Installation

See [How_to_Install_a_Plugin](http://projects.theforeman.org/projects/foreman/wiki/How_to_Install_a_Plugin)
for how to install Foreman plugins

## Usage

*Usage here*

### In Satellite

#### Inventory upload

In UI: Configure -> Inventory Upload -> Restart

From command-line:

    export organization_id=1
    export target=/var/lib/foreman/red_hat_inventory/generated_reports/
    /usr/sbin/foreman-rake rh_cloud_inventory:report:generate

#### Fetch hosts remediation data

In UI: Configure -> Insights -> Sync now

From command-line:

    /usr/sbin/foreman-rake rh_cloud_inventory:sync

#### Synchronize inventory status

In UI: Configure -> Inventory Upload -> Sync inventory status

From command-line:

    # all organizations
    /usr/sbin/foreman-rake rh_cloud_insights:sync
    
    # specific organization with id 1
    export organization_id=1
    /usr/sbin/foreman-rake rh_cloud_insights:sync

## TODO

*Todo list here*

## Contributing

Fork and send a Pull Request. Thanks!

## Copyright

Copyright (c) *year* *your name*

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

