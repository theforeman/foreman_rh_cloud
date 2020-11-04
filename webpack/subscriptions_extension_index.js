import { subscriptionCountListener, manifestModalListener } from './ForemanInventoryUpload/SubscriptionsPageExtension/SubscriptionsPageExtensionActions';

if (window.location.pathname === '/subscriptions') {
  window.tfm.store.observeStore(
    'katello.subscriptions.itemCount',
    subscriptionCountListener
  );

  window.tfm.store.observeStore(
    'foremanModals.manageManifestModal.isOpen',
    manifestModalListener
  );
}
