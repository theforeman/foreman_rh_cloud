import { subscriptionCountListener } from './ForemanInventoryUpload/SubscriptionsPageExtension/SubscriptionsPageExtensionActions';

if (window.location.pathname === '/subscriptions') {
  window.tfm.store.observeStore(
    'katello.subscriptions.itemCount',
    subscriptionCountListener
  );
}
