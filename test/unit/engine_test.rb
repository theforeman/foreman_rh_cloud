require 'test_plugin_helper'

class EngineTest < ActiveSupport::TestCase
  test 'Random cronlines are valid cronlines' do
    Random.any_instance.expects(:rand).with(3.hours.minutes).returns(62.minutes)

    random_cronline = ForemanRhCloud::Engine.randomize_cron_line

    assert_equal '2 1 * * *', random_cronline
  end

  context '#register_scheduled_task' do
    setup do
      ForemanTasks::RecurringLogic.stubs(:transaction).yields
    end

    test 'creates a new recurring logic with custom cronline' do
      ForemanTasks::RecurringLogic.any_instance.expects(:start).with(EngineTest)

      ForemanRhCloud::Engine.register_scheduled_task(
        EngineTest, # the class doesn't matter
        'TEST CRONLINE',
        '1 2 3 4 5'
      )

      assert_not_nil ForemanTasks::RecurringLogic.where(cron_line: '1 2 3 4 5').first
      assert_equal 1, ForemanTasks::RecurringLogic.where(cron_line: '1 2 3 4 5').count
    end

    test 'creates a new recurring logic with default cronline' do
      ForemanTasks::RecurringLogic.any_instance.expects(:start).with(EngineTest)

      ForemanRhCloud::Engine.register_scheduled_task(
        EngineTest, # the class doesn't matter
        '2 3 4 5 6',
        nil
      )

      assert_not_nil ForemanTasks::RecurringLogic.where(cron_line: '2 3 4 5 6').first
      assert_equal 1, ForemanTasks::RecurringLogic.where(cron_line: '2 3 4 5 6').count
    end

    test 'redefines recurring logic with custom cronline' do
      task = FactoryBot.create(:some_task, label: EngineTest.name)
      mock_recurring_logic(cron_line: '1 2 3 4 5', task: task)
      ForemanTasks::RecurringLogic.any_instance.expects(:start).with(EngineTest)

      ForemanRhCloud::Engine.register_scheduled_task(
        EngineTest, # the class doesn't matter
        'TEST CRONLINE',
        '2 3 4 5 6'
      )

      assert_not_nil ForemanTasks::RecurringLogic.where(cron_line: '2 3 4 5 6').first
      assert_equal 1, ForemanTasks::RecurringLogic.where(cron_line: '2 3 4 5 6').count
    end

    test 'redefines recurring logic with default cronline if the value is 00:00' do
      task = FactoryBot.create(:some_task, label: EngineTest.name)
      mock_recurring_logic(cron_line: '0 0 * * *', task: task)
      ForemanTasks::RecurringLogic.any_instance.expects(:start).with(EngineTest)

      ForemanRhCloud::Engine.register_scheduled_task(
        EngineTest, # the class doesn't matter
        '1 2 3 4 5',
        nil
      )

      assert_not_nil ForemanTasks::RecurringLogic.where(cron_line: '1 2 3 4 5').first
      assert_equal 1, ForemanTasks::RecurringLogic.where(cron_line: '1 2 3 4 5').count
    end

    test 'does not redefine recurring logic with same cronline' do
      task = FactoryBot.create(:some_task, label: EngineTest.name)
      logic = mock_recurring_logic(cron_line: '1 2 3 4 5', task: task)
      logic.state = 'active'
      logic.save!
      ForemanTasks::RecurringLogic.any_instance.expects(:start).with(EngineTest).never

      ForemanRhCloud::Engine.register_scheduled_task(
        EngineTest, # the class doesn't matter
        '2 3 4 5 6',
        '1 2 3 4 5'
      )

      assert_not_nil ForemanTasks::RecurringLogic.where(cron_line: '1 2 3 4 5').first
      assert_equal 1, ForemanTasks::RecurringLogic.where(cron_line: '1 2 3 4 5').count
    end

    def mock_recurring_logic(cron_line:, task:)
      logic = FactoryBot.build(:recurring_logic, cron_line: cron_line)
      logic.task_group.tasks << task
      logic.save!
      logic
    end
  end
end
