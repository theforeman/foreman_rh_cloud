import {
  modulesConfig,
  mockUser,
  createProviderOptions,
} from '../ScalprumContext';

describe('ScalprumContext', () => {
  describe('modulesConfig', () => {
    it('should have vulnerability module config', () => {
      expect(modulesConfig.vulnerability).toBeDefined();
      expect(modulesConfig.vulnerability.name).toBe('vulnerability');
    });

    it('should have advisor module config', () => {
      expect(modulesConfig.advisor).toBeDefined();
      expect(modulesConfig.advisor.name).toBe('advisor');
    });

    it('should have inventory module config', () => {
      expect(modulesConfig.inventory).toBeDefined();
      expect(modulesConfig.inventory.name).toBe('inventory');
    });
  });

  describe('mockUser', () => {
    it('should have identity with org_id FOREMAN', () => {
      expect(mockUser.identity.org_id).toBe('FOREMAN');
    });
  });

  describe('createProviderOptions', () => {
    it('should have isBeta function', () => {
      const options = createProviderOptions([]);
      expect(options.api.chrome.isBeta).toBeInstanceOf(Function);
      expect(options.api.chrome.isBeta()).toBe(false);
    });

    it('should have auth.getUser that resolves to mockUser', async () => {
      const options = createProviderOptions([]);
      expect(options.api.chrome.auth.getUser).toBeInstanceOf(Function);
      const user = await options.api.chrome.auth.getUser();
      expect(user).toEqual(mockUser);
    });

    it('should return empty array when no permissions provided', async () => {
      const options = createProviderOptions([]);
      const permissions = await options.api.chrome.auth.getUserPermissions();
      expect(permissions).toEqual([]);
    });

    describe('getUserPermissions', () => {
      const testPermissions = [
        { permission: 'inventory:hosts:read', resourceDefinitions: [] },
        {
          permission: 'vulnerability:vulnerability_results:read',
          resourceDefinitions: [],
        },
        {
          permission: 'vulnerability:system.opt_out:read',
          resourceDefinitions: [],
        },
      ];

      it('should filter vulnerability permissions by app prefix', async () => {
        const options = createProviderOptions(testPermissions);
        const permissions = await options.api.chrome.auth.getUserPermissions(
          'vulnerability'
        );

        expect(permissions).toHaveLength(2);
        expect(permissions[0].permission).toBe(
          'vulnerability:vulnerability_results:read'
        );
      });

      it('should filter inventory permissions by app prefix', async () => {
        const options = createProviderOptions(testPermissions);
        const permissions = await options.api.chrome.auth.getUserPermissions(
          'inventory'
        );

        expect(permissions).toHaveLength(1);
        expect(permissions[0].permission).toBe('inventory:hosts:read');
      });

      it('should return all permissions when no app filter is provided', async () => {
        const options = createProviderOptions(testPermissions);
        const permissions = await options.api.chrome.auth.getUserPermissions();

        expect(permissions).toHaveLength(3);
      });

      it('should return permissions in Chrome API format', async () => {
        const options = createProviderOptions(testPermissions);
        const permissions = await options.api.chrome.auth.getUserPermissions(
          'vulnerability'
        );

        expect(permissions[0]).toHaveProperty('permission');
        expect(permissions[0]).toHaveProperty('resourceDefinitions');
        expect(Array.isArray(permissions[0].resourceDefinitions)).toBe(true);
      });

      it('should handle permissions with missing permission field', async () => {
        const malformedPermissions = [
          { permission: 'inventory:hosts:read', resourceDefinitions: [] },
          { resourceDefinitions: [] }, // missing permission field
          { permission: null, resourceDefinitions: [] },
        ];
        const options = createProviderOptions(malformedPermissions);

        const permissions = await options.api.chrome.auth.getUserPermissions(
          'inventory'
        );
        expect(permissions).toHaveLength(1);
        expect(permissions[0].permission).toBe('inventory:hosts:read');
      });
    });
  });
});
