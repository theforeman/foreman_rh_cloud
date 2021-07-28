require 'test_helper'
require 'foreman_tasks/test_helpers'

class InsightsRulesSyncTest < ActiveSupport::TestCase
  include ForemanTasks::TestHelpers::WithInThreadExecutor

  setup do
    rules_json = <<-'RULES_JSON'
    {
      "meta": {
        "count": 2
      },
      "links": {
        "first": "/api/insights/v1/rule/?has_playbook=true\u0026impacting=true\u0026limit=2\u0026offset=0\u0026rule_status=enabled",
        "next": "/api/insights/v1/rule/?has_playbook=true\u0026impacting=true\u0026limit=2\u0026offset=2\u0026rule_status=enabled",
        "previous": "/api/insights/v1/rule/?has_playbook=true\u0026impacting=true\u0026limit=2\u0026offset=0\u0026rule_status=enabled",
        "last": "/api/insights/v1/rule/?has_playbook=true\u0026impacting=true\u0026limit=2\u0026offset=1\u0026rule_status=enabled"
      },
      "data": [
        {
        "rule_id": "test_rule|TEST_RULE",
        "created_at": "2020-09-25T07:37:09.745864Z",
        "updated_at": "2020-10-23T02:43:09.662260Z",
        "description": "Kdump auto crashkernel reservation failed because the total memory does not meet the minimum requirement",
        "active": true,
        "category": {
          "id": 1,
          "name": "Availability"
        },
        "impact": {
          "name": "Diagnostics Failure",
          "impact": 1
        },
        "likelihood": 4,
        "node_id": "1186753",
        "tags": "incident kdump",
        "playbook_count": 1,
        "reboot_required": false,
        "publish_date": "2020-10-01T19:04:00Z",
        "summary": "Kdump fails to collect vmcore when the reserved size does not meet the minimum requirement.\n",
        "generic": "Automatic reservation did not work because the total memory does not meet the minimum requirement for kdump.\n",
        "reason": "{{?pydata.error_key == \"CRASHKERNEL_RECOMMENDED_VALUE_V2\"}}\nThis **{{=pydata.value[3]}}** system is running with a total memory of **{{=pydata.value[0]}}MB**. The kdump reserved size is **{{=pydata.value[1]}}MB** while the minimum amount of reserved memory required for memory **{{=pydata.value[0]}}MB** is **{{=pydata.value[2]}}MB**. \n\n{{?pydata.version == 7}}\n* [Minimum Amount of Reserved Memory Required for kdump](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/kernel_administration_guide/kernel_crash_dump_guide#sect-kdump-memory-requirements)\n{{?}}\n{{?pydata.version == 8}}\n* [Minimum Amount of Reserved Memory Required for kdump](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/managing_monitoring_and_updating_the_kernel/installing-and-configuring-kdump_managing-monitoring-and-updating-the-kernel#memory-requirements-for-kdump_supported-kdump-configurations-and-targets)\n{{?}}\n{{?}}\n\n{{?pydata.error_key == \"CRASHKERNEL_AUTO_FAILURE_V2\"}}\nThis **{{=pydata.value[2]}}** system is running with a total memory of **{{=pydata.value[0]}}MB**. The **crashkernel** is configured as **auto** and the minimum amount of memory required for automatic memory reservation is **{{=pydata.auto_minimum}}MB**. As the total memory does not meet the requirement, kdump auto crashkernel reservation failed with following log:\n  ~~~\n  {{=pydata.msg}}\n  ~~~\n\n{{?pydata.version == 7}}\n* [Minimum Amount of Memory Required for Automatic Memory Reservation](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/kernel_administration_guide/kernel_crash_dump_guide#sect-kdump-memory-thresholds)\n\n* [Minimum Amount of Reserved Memory Required for kdump](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/kernel_administration_guide/kernel_crash_dump_guide#sect-kdump-memory-requirements)\n{{?}}\n{{?pydata.version == 8}}\n* [Minimum Amount of Memory Required for Automatic Memory Reservation](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/managing_monitoring_and_updating_the_kernel/installing-and-configuring-kdump_managing-monitoring-and-updating-the-kernel#minimum-threshold-for-automatic-memory-reservation_supported-kdump-configurations-and-targets)\n\n* [Minimum Amount of Reserved Memory Required for kdump](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/managing_monitoring_and_updating_the_kernel/installing-and-configuring-kdump_managing-monitoring-and-updating-the-kernel#memory-requirements-for-kdump_supported-kdump-configurations-and-targets)\n{{?}}\n{{?}}\n",
        "more_info": "{{?pydata.version == 7}}\n* [How should the crashkernel parameter be configured for using kdump on RHEL7 ?](https://access.redhat.com/solutions/916043)\n{{?}}\n{{?pydata.version == 8}}\n* [How should the crashkernel parameter be configured for using kdump on Red Hat Enterprise Linux 8 ?](https://access.redhat.com/solutions/3698411)\n{{?}}\n",
        "impacted_systems_count": 2,
        "reports_shown": true,
        "rule_status": "enabled",
        "resolution_set": [{
            "system_type": 105,
            "resolution": "Red Hat recommends that you change the **crashkernel** setting in the `grub.conf` file.\n\n{{?pydata.error_key == \"CRASHKERNEL_RECOMMENDED_VALUE_V2\"}}\n1. Update the value of the **\"crashkernel\"** kernel parameter:\n  ~~~\n  # grubby --update-kernel=ALL --args=crashkernel={{=pydata.value[2]}}M\n  ~~~\n1. Reboot the system:\n  ~~~\n  # reboot\n  ~~~\n{{?}}\n\n\n{{?pydata.error_key == \"CRASHKERNEL_AUTO_FAILURE_V2\"}}\n1. Update the value of the **\"crashkernel\"** kernel parameter:\n  ~~~\n  # grubby --update-kernel=ALL --args=crashkernel={{=pydata.value[1]}}M\n  ~~~\n1. Reboot the system:\n  ~~~\n  # reboot\n  ~~~\n{{?}}\n",
            "resolution_risk": {
              "name": "Update Service Configuration",
              "risk": 1
            },
            "has_playbook": true
          },
          {
            "system_type": 105,
            "resolution": "Red Hat recommends that you change the **crashkernel** setting in the `grub.conf` file.\n\n{{?pydata.error_key == \"CRASHKERNEL_RECOMMENDED_VALUE_V2\"}}\n1. Update the value of the **\"crashkernel\"** kernel parameter:\n  ~~~\n  # grubby --update-kernel=ALL --args=crashkernel={{=pydata.value[2]}}M\n  ~~~\n1. Reboot the system:\n  ~~~\n  # reboot\n  ~~~\n{{?}}\n\n\n{{?pydata.error_key == \"CRASHKERNEL_AUTO_FAILURE_V2\"}}\n1. Update the value of the **\"crashkernel\"** kernel parameter:\n  ~~~\n  # grubby --update-kernel=ALL --args=crashkernel={{=pydata.value[1]}}M\n  ~~~\n1. Reboot the system:\n  ~~~\n  # reboot\n  ~~~\n{{?}}\n",
            "resolution_risk": {
              "name": "test resolution name",
              "risk": 2
            },
            "has_playbook": true
          }],
        "total_risk": 2,
        "hosts_acked_count": 0,
        "rating": 0
      }, {
        "rule_id": "test_rule2|TEST_RULE2",
        "created_at": "2019-02-07T19:02:34.501496Z",
        "updated_at": "2020-08-10T20:42:48.967063Z",
        "description": "\"SMBLoris\" Samba denial of service",
        "active": true,
        "category": {
          "id": 2,
          "name": "Security"
        },
        "impact": {
          "name": "Denial Of Service",
          "impact": 3
        },
        "likelihood": 3,
        "node_id": "",
        "tags": "samba security",
        "playbook_count": 1,
        "reboot_required": false,
        "publish_date": "2017-08-08T15:52:38Z",
        "summary": "A denial of service flaw exists in Samba. The vulnerability has not been assigned a CVE.\n\nA remote attacker in a position to supply the crafted data can render system unusable.\n",
        "generic": "A denial of service flaw exists in Samba that allows a remote attacker to supply crafted NetBIOS Session Service headers and cause out-of-memory state.\n\nRed Hat recommends that you apply mitigation or update Samba packages once fixed packages are available.\n",
        "reason": "This machine is vulnerable because:\n\n* It has the following vulnerable Samba server package installed: **{{=pydata.INSTALLED_PACKAGES[Object.keys(pydata.INSTALLED_PACKAGES)[0]]}}**\n{{? pydata.SERVICE_RUNNING }}* An `smbd` process is running.\n{{?}}{{? pydata.SERVICE_ENABLED }}* The `smb` service is enabled.\n{{?}}{{? pydata.assuming_port_listening }}* The system {{? pydata.port_listening }}is{{??}}may be{{?}} listening on port 445.\n{{?}}{{? pydata.assuming_port_reachable }}* Port 445 appears to allow external connections.\n{{?}}\n\nBased on this information, a vulnerable version of Samba is being actively used on this machine.\n\n{{? !pydata.iptables_info_available || !pydata.netstat_info_available }}\nBecause information about this system's {{? !pydata.iptables_info_available }} firewall {{? !pydata.netstat_info_available }}and{{?}}{{?}} {{? !pydata.netstat_info_available }}listening services {{?}}is not available, it is not possible to determine this system's exact level of vulnerability.\n{{?}}\n\n{{? !pydata.samba_config_info  }}\nBecause information about this system's smb.conf is not available, it is not possible to determine whether the mitigation is applied.\n{{?}}\n",
        "more_info": "* For more information about the denial of service flaw see [knowledge base article](https://access.redhat.com/security/vulnerabilities/smbloris).\n* To learn how to upgrade packages, see \"[What is yum and how do I use it?](https://access.redhat.com/solutions/9934).\"\n* [Using Firewalls](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/7/html/Security_Guide/sec-Using_Firewalls.html) in RHEL 7\n* [Using Firewalls](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/6/html/Security_Guide/sect-Security_Guide-Firewalls.html) in RHEL 6\n* The Customer Portal page for the [Red Hat Security Team](https://access.redhat.com/security/) contains more information about policies, procedures, and alerts for Red Hat Products.\n* The Security Team also maintains a frequently updated blog at [securityblog.redhat.com](https://securityblog.redhat.com).\n",
        "impacted_systems_count": 1,
        "reports_shown": true,
        "rule_status": "enabled",
        "resolution_set": [{
          "system_type": 105,
          "resolution": "{{ var FIXED_PACKAGES_AVAILABLE=false; }}\n{{? false == FIXED_PACKAGES_AVAILABLE \u0026\u0026 \"Frontend until fixed packages are available.\"}}\nRed Hat recommends that you use the following mitigation:\n\nLimit the number of smbd processes by modifying `/etc/samba/smb.conf` and add the following line to the `[global]` section:\n~~~\nmax smbd processes = 1000\n~~~\n\nThen restart Samba service:\n{{? pydata.rhel_version == 6 }}\n~~~\n# service smb restart\n~~~\n{{?}}\n{{? pydata.rhel_version == 7 }}\n~~~\n# systemctl restart smb.service\n~~~\n{{?}}\n\n{{? pydata.assuming_port_reachable }}\nRed Hat recommends that you limit access to port 445 from untrusted sources. Please refer to the documentation of the firewall you use.\n\n{{? !pydata.iptables_info_available || !pydata.netstat_info_available }}\nBecause information about this system's {{? !pydata.iptables_info_available }} firewall {{? !pydata.netstat_info_available }}and{{?}}{{?}} {{? !pydata.netstat_info_available }}listening services {{?}}is not available, it is not possible to determine whether this system's port 445 is accessible.\n\n{{?}}\nRed Hat recommends that you test the new settings before applying them to production systems.\n{{?}}\n{{?}}\n{{? true == FIXED_PACKAGES_AVAILABLE \u0026\u0026 \"Frontend after fixed packages are available.\"}}\nRed Hat recommends that you update Samba packages to include the CVE-2017-TODO security release, and restart the Samba service.\n\n{{? pydata.rhel_version == 6 }}\n~~~\n# yum update {{=Object.keys(pydata.INSTALLED_PACKAGES).join(\" \")}}\n# service smb restart\n~~~\n{{?}}\n{{? pydata.rhel_version == 7 }}\n~~~\n# yum update {{=Object.keys(pydata.INSTALLED_PACKAGES).join(\" \")}}\n# systemctl restart smb.service\n~~~\n{{?}}\n\n**Alternatively**, you can use the following mitigation:\n\nLimit the number of smbd processes by modifying `/etc/samba/smb.conf` and add the following line to the `[global]` section:\n~~~\nmax smbd processes = 1000\n~~~\n\nThen restart Samba service:\n{{? pydata.rhel_version == 6 }}\n~~~\n# service smb restart\n~~~\n{{?}}\n{{? pydata.rhel_version == 7 }}\n~~~\n# systemctl restart smb.service\n~~~\n{{?}}\n\n{{? pydata.assuming_port_reachable }}\nRed Hat recommends that you limit access to port 445 from untrusted sources. Please refer to the documentation of the firewall you use.\n\n{{? !pydata.iptables_info_available || !pydata.netstat_info_available }}\nBecause information about this system's {{? !pydata.iptables_info_available }} firewall {{? !pydata.netstat_info_available }}and{{?}}{{?}} {{? !pydata.netstat_info_available }}listening services {{?}}is not available, it is not possible to determine whether this system's port 445 is accessible.\n\n{{?}}\nRed Hat recommends that you test the new settings before applying them to production systems.\n{{?}}\n\n\n{{?}}\n",
          "resolution_risk": {
            "name": "Update Service Configuration",
            "risk": 1
          },
          "has_playbook": true
        }],
        "total_risk": 3,
        "hosts_acked_count": 0,
        "rating": 0
      }]
    }
    RULES_JSON
    @rules = JSON.parse(rules_json)
    @host = FactoryBot.create(:host, :managed, name: 'host1')
    @hit = FactoryBot.create(:insights_hit, host_id: @host.id)

    InsightsCloud::Async::InsightsRulesSync.any_instance.stubs(:plan_resolutions)
    FactoryBot.create(:setting, name: 'rh_cloud_token', value: 'MOCK_TOKEN')
  end

  test 'Hits data is replaced with data from cloud' do
    InsightsCloud::Async::InsightsRulesSync.any_instance.expects(:query_insights_rules).returns(@rules)

    ForemanTasks.sync_task(InsightsCloud::Async::InsightsRulesSync)
    @hit.reload

    assert_equal 2, InsightsRule.all.count
    assert_not_nil @hit.rule
    assert_equal true, @hit.has_playbook?
  end

  test 'Rules queries support pagination' do
    last_rule_json = <<-'RULES_JSON'
    {
      "meta": {
        "count": 1
      },
      "links": {
        "first": "/api/insights/v1/rule/?has_playbook=true\u0026impacting=true\u0026limit=2\u0026offset=0\u0026rule_status=enabled",
        "next": "/api/insights/v1/rule/?has_playbook=true\u0026impacting=true\u0026limit=2\u0026offset=2\u0026rule_status=enabled",
        "previous": "/api/insights/v1/rule/?has_playbook=true\u0026impacting=true\u0026limit=2\u0026offset=0\u0026rule_status=enabled",
        "last": "/api/insights/v1/rule/?has_playbook=true\u0026impacting=true\u0026limit=2\u0026offset=1\u0026rule_status=enabled"
      },
      "data": [
        {
          "rule_id": "crashkernel_reservation_value|CRASHKERNEL_AUTO_FAILURE_V2",
          "created_at": "2020-09-25T07:37:09.745864Z",
          "updated_at": "2020-10-23T02:43:09.662260Z",
          "description": "Kdump auto crashkernel reservation failed because the total memory does not meet the minimum requirement",
          "active": true,
          "category": {
            "id": 1,
            "name": "Availability"
          },
          "impact": {
            "name": "Diagnostics Failure",
            "impact": 1
          },
          "likelihood": 4,
          "node_id": "1186753",
          "tags": "incident kdump",
          "playbook_count": 1,
          "reboot_required": false,
          "publish_date": "2020-10-01T19:04:00Z",
          "summary": "Kdump fails to collect vmcore when the reserved size does not meet the minimum requirement.\n",
          "generic": "Automatic reservation did not work because the total memory does not meet the minimum requirement for kdump.\n",
          "reason": "{{?pydata.error_key == \"CRASHKERNEL_RECOMMENDED_VALUE_V2\"}}\nThis **{{=pydata.value[3]}}** system is running with a total memory of **{{=pydata.value[0]}}MB**. The kdump reserved size is **{{=pydata.value[1]}}MB** while the minimum amount of reserved memory required for memory **{{=pydata.value[0]}}MB** is **{{=pydata.value[2]}}MB**. \n\n{{?pydata.version == 7}}\n* [Minimum Amount of Reserved Memory Required for kdump](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/kernel_administration_guide/kernel_crash_dump_guide#sect-kdump-memory-requirements)\n{{?}}\n{{?pydata.version == 8}}\n* [Minimum Amount of Reserved Memory Required for kdump](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/managing_monitoring_and_updating_the_kernel/installing-and-configuring-kdump_managing-monitoring-and-updating-the-kernel#memory-requirements-for-kdump_supported-kdump-configurations-and-targets)\n{{?}}\n{{?}}\n\n{{?pydata.error_key == \"CRASHKERNEL_AUTO_FAILURE_V2\"}}\nThis **{{=pydata.value[2]}}** system is running with a total memory of **{{=pydata.value[0]}}MB**. The **crashkernel** is configured as **auto** and the minimum amount of memory required for automatic memory reservation is **{{=pydata.auto_minimum}}MB**. As the total memory does not meet the requirement, kdump auto crashkernel reservation failed with following log:\n  ~~~\n  {{=pydata.msg}}\n  ~~~\n\n{{?pydata.version == 7}}\n* [Minimum Amount of Memory Required for Automatic Memory Reservation](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/kernel_administration_guide/kernel_crash_dump_guide#sect-kdump-memory-thresholds)\n\n* [Minimum Amount of Reserved Memory Required for kdump](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/7/html/kernel_administration_guide/kernel_crash_dump_guide#sect-kdump-memory-requirements)\n{{?}}\n{{?pydata.version == 8}}\n* [Minimum Amount of Memory Required for Automatic Memory Reservation](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/managing_monitoring_and_updating_the_kernel/installing-and-configuring-kdump_managing-monitoring-and-updating-the-kernel#minimum-threshold-for-automatic-memory-reservation_supported-kdump-configurations-and-targets)\n\n* [Minimum Amount of Reserved Memory Required for kdump](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/8/html/managing_monitoring_and_updating_the_kernel/installing-and-configuring-kdump_managing-monitoring-and-updating-the-kernel#memory-requirements-for-kdump_supported-kdump-configurations-and-targets)\n{{?}}\n{{?}}\n",
          "more_info": "{{?pydata.version == 7}}\n* [How should the crashkernel parameter be configured for using kdump on RHEL7 ?](https://access.redhat.com/solutions/916043)\n{{?}}\n{{?pydata.version == 8}}\n* [How should the crashkernel parameter be configured for using kdump on Red Hat Enterprise Linux 8 ?](https://access.redhat.com/solutions/3698411)\n{{?}}\n",
          "impacted_systems_count": 2,
          "reports_shown": true,
          "rule_status": "enabled",
          "resolution_set": [{
              "system_type": 105,
              "resolution": "Red Hat recommends that you change the **crashkernel** setting in the `grub.conf` file.\n\n{{?pydata.error_key == \"CRASHKERNEL_RECOMMENDED_VALUE_V2\"}}\n1. Update the value of the **\"crashkernel\"** kernel parameter:\n  ~~~\n  # grubby --update-kernel=ALL --args=crashkernel={{=pydata.value[2]}}M\n  ~~~\n1. Reboot the system:\n  ~~~\n  # reboot\n  ~~~\n{{?}}\n\n\n{{?pydata.error_key == \"CRASHKERNEL_AUTO_FAILURE_V2\"}}\n1. Update the value of the **\"crashkernel\"** kernel parameter:\n  ~~~\n  # grubby --update-kernel=ALL --args=crashkernel={{=pydata.value[1]}}M\n  ~~~\n1. Reboot the system:\n  ~~~\n  # reboot\n  ~~~\n{{?}}\n",
              "resolution_risk": {
                "name": "Update Service Configuration",
                "risk": 1
              },
              "has_playbook": true
            },
            {
              "system_type": 105,
              "resolution": "Red Hat recommends that you change the **crashkernel** setting in the `grub.conf` file.\n\n{{?pydata.error_key == \"CRASHKERNEL_RECOMMENDED_VALUE_V2\"}}\n1. Update the value of the **\"crashkernel\"** kernel parameter:\n  ~~~\n  # grubby --update-kernel=ALL --args=crashkernel={{=pydata.value[2]}}M\n  ~~~\n1. Reboot the system:\n  ~~~\n  # reboot\n  ~~~\n{{?}}\n\n\n{{?pydata.error_key == \"CRASHKERNEL_AUTO_FAILURE_V2\"}}\n1. Update the value of the **\"crashkernel\"** kernel parameter:\n  ~~~\n  # grubby --update-kernel=ALL --args=crashkernel={{=pydata.value[1]}}M\n  ~~~\n1. Reboot the system:\n  ~~~\n  # reboot\n  ~~~\n{{?}}\n",
              "resolution_risk": {
                "name": "test resolution name",
                "risk": 2
              },
              "has_playbook": true
            }],
          "total_risk": 2,
          "hosts_acked_count": 0,
          "rating": 0
        }]
    }
    RULES_JSON
    @last_rule = JSON.parse(last_rule_json)

    @rules['meta']['count'] = 3

    InsightsCloud::Async::InsightsRulesSync.any_instance.
      stubs(:query_insights_rules).returns(@rules).then.returns(@last_rule)

    ForemanTasks.sync_task(InsightsCloud::Async::InsightsRulesSync)

    assert_equal 3, InsightsRule.all.count
  end
end
