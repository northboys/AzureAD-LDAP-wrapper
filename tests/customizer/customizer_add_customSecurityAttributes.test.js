'use strict';

process.env.SKIP_DOTENV = "true";
const customizer = require('../../customizer/customizer_add_customSecurityAttributes');

// jest.mock('../../helper');

describe('customizer security attributes tests', () => {
    beforeAll(() => {
        // Set before all tests
    });

    beforeEach(() => {
        jest.resetModules();
        jest.spyOn(console, 'log').mockImplementation(() => { });
        jest.spyOn(console, 'warn').mockImplementation(() => { });
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        console.log.mockRestore();
        console.warn.mockRestore();
        console.error.mockRestore();
    });

    afterAll(() => {
        // Clean up after all tests have run
        // delete process.env.NODE_ENV;
        // delete process.env.LDAP_SYNC_TIME;
        // restore original console log
    });

    test('DSM7 = false', () => {
        // Run your test here

        const apiConfig = { "uri": "uri", "gri": "gri", "mri": "mri" };
        expect(customizer.modifyGraphApiConfig(apiConfig, "hello-wordl")).toStrictEqual(apiConfig);
        expect(customizer.modifyGraphApiConfig(apiConfig, "hello-wordl")).toMatchObject(apiConfig);

        const azuredata = {
            "@odata.context": "https://graph.microsoft.com/beta/$metadata#users(customSecurityAttributes)/$entity",
            "identities": [
                {
                    "signInType": "userPrincipalName",
                }
            ],
            "customSecurityAttributes": {
                "Marketing": {
                    "@odata.type": "#microsoft.graph.customSecurityAttributeValue",
                    "EmployeeId": "QN26904"
                },
                "Engineering": {
                    "@odata.type": "#microsoft.graph.customSecurityAttributeValue",
                    "Project@odata.type": "#Collection(String)",
                    "Project": [
                        "Baker",
                        "Cascade"
                    ],
                    "CostCenter@odata.type": "#Collection(Int32)",
                    "CostCenter": [
                        1001
                    ],
                    "Certification": true
                },
                "@odata.type": "#microsoft.graph.customSecurityAttributeValue",
            }
        };

        const user = { "creatorsName": "none" };
        const user_comp = {
            "creatorsName": "none", "customSecurityAttributes_Engineering_Certification": true,
            "customSecurityAttributes_Engineering_CostCenter": [
                1001
            ],
            "customSecurityAttributes_Engineering_Project":
                [
                    "Baker",
                    "Cascade",
                ],
            "customSecurityAttributes_Marketing": {
                "@odata.type": "#microsoft.graph.customSecurityAttributeValue",
                "EmployeeId": "QN26904",
            }
        };
        const user_comp2 = {
            "creatorsName": "uid=root,cn=users,dc=example,dc=net", "customSecurityAttributes_Engineering_Certification": true,
            "customSecurityAttributes_Engineering_CostCenter": [
                1001
            ],
            "customSecurityAttributes_Engineering_Project":
                [
                    "Baker",
                    "Cascade",
                ],
            "customSecurityAttributes_Marketing": {
                "@odata.type": "#microsoft.graph.customSecurityAttributeValue",
                "EmployeeId": "QN26904",
            }
        };
        const group = { "creatorsName": "none" };
        const all = { "user": user, "group": group, "samba": { namingContexts: "nc", sambaDomainName: "SAMBA" } };




        expect(customizer.ModifyLDAPGroup(group)).toStrictEqual(group);
        expect(customizer.ModifyLDAPUser(user, azuredata)).toStrictEqual(user_comp);
        expect(customizer.ModifyLDAPGlobal(all)).toStrictEqual(all);

        expect(customizer.ModifyLDAPGroup(group)).toMatchObject(group);
        expect(customizer.ModifyLDAPUser(user, azuredata)).toMatchObject(user_comp2);
        expect(customizer.ModifyLDAPGlobal(all)).toMatchObject(all);

    });

    test('DSM7 = true', () => {
        // Run your test here

        const num_azuredata = { "hello": "world" };
        const num_user = { "gidNumber": "123", "uidNumber": "456", "creatorsName": "none" };
        const num_user_comp = { "gidNumber": 123, "uidNumber": 456, "creatorsName": "none", "hello": "world" };
        const num_user_comp2 = { "gidNumber": 123, "uidNumber": 456, "creatorsName": "uid=root,cn=users,dc=example,dc=net", "hello": "world" };
        const num_group = { "gidNumber": "123", "creatorsName": "none" };
        const num_all = { "user": num_user, "group": num_group, "samba": { namingContexts: "nc", sambaDomainName: "SAMBA" } };

        expect(customizer).toHaveProperty("modifyGraphApiConfig");
        expect(customizer).toHaveProperty("ModifyAzureGroups");
        expect(customizer).toHaveProperty("ModifyAzureUsers");

        expect(customizer.ModifyLDAPGroup(num_group)).toStrictEqual(num_group);
        expect(customizer.ModifyLDAPUser(num_user, num_azuredata)).toStrictEqual(num_user_comp);
        expect(customizer.ModifyLDAPGlobal(num_all)).toStrictEqual(num_all);

        expect(customizer.ModifyLDAPGroup(num_group)).toMatchObject(num_group);
        expect(customizer.ModifyLDAPUser(num_user, num_azuredata)).toMatchObject(num_user_comp2);
        expect(customizer.ModifyLDAPGlobal(num_all)).toMatchObject(num_all);

        expect(customizer.ModifyLDAPGroup(num_group).gidNumber).toBe(123);
        expect(customizer.ModifyLDAPUser(num_user, num_azuredata).uidNumber).toBe(456);
        expect(customizer.ModifyLDAPGlobal(num_all).creatorsName).toBe(undefined);

        const non_num_azuredata = { "hello": "world" };
        const non_num_user = { "gidNumber": "x123", "uidNumber": "x456", "creatorsName": "none" };
        const non_num_user_comp = { "gidNumber": "x123", "uidNumber": "x456", "creatorsName": "none", "hello": "world" };
        const non_num_user_comp2 = { "gidNumber": "x123", "uidNumber": "x456", "creatorsName": "uid=root,cn=users,dc=example,dc=net", "hello": "world" };
        const non_num_group = { "gidNumber": "x123", "creatorsName": "none" };
        const non_num_all = { "user": non_num_user, "group": non_num_group };

        expect(customizer).toHaveProperty("modifyGraphApiConfig");
        expect(customizer).toHaveProperty("ModifyAzureGroups");
        expect(customizer).toHaveProperty("ModifyAzureUsers");

        expect(customizer.ModifyLDAPGroup(non_num_group)).toStrictEqual(non_num_group);
        expect(customizer.ModifyLDAPUser(non_num_user, non_num_azuredata)).toStrictEqual(non_num_user_comp);
        expect(customizer.ModifyLDAPGlobal(non_num_all)).toStrictEqual(non_num_all);

        expect(customizer.ModifyLDAPGroup(non_num_group)).toMatchObject(non_num_group);
        expect(customizer.ModifyLDAPUser(non_num_user, non_num_azuredata)).toMatchObject(non_num_user_comp2);
        expect(customizer.ModifyLDAPGlobal(non_num_all)).toMatchObject(non_num_all);

        expect(customizer.ModifyLDAPGroup(non_num_group).gidNumber).toBe("x123");
        expect(customizer.ModifyLDAPUser(non_num_user, non_num_azuredata).uidNumber).toBe("x456");
        expect(customizer.ModifyLDAPGlobal(non_num_all).creatorsName).toBe(undefined);

        let ma = [{ "entry": "a" }, { "entry": "b" }];
        expect(customizer.ModifyAzureGroups(ma)).toMatchObject(ma);
        expect(customizer.ModifyAzureUsers(ma)).toMatchObject(ma);

    });
});

