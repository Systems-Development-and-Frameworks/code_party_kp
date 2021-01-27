import { shallowMount, createLocalVue, RouterLinkStub } from "@vue/test-utils";
import Vuex from "vuex";
import Header from "./Header.vue";


const localVue = createLocalVue();
localVue.use(Vuex);

describe("Header.vue", () => {
    let actions;
    let getters;
    let store;

    const setupWrapper = () => {
        store = new Vuex.Store({
            modules: {
                auth: {
                    namespaced: true,
                    state: () => ({
                        currentUser: null,
                        token: null
                    }),
                    actions,
                    getters
                }
            }
        });
        return shallowMount(Header, { store, stubs: { NuxtLink: RouterLinkStub }, localVue });
    };
    beforeEach(() => {
        getters = {
            isAuthenticated: () => false
        };

    });

    describe("Menu Component", () => {
        describe("if authenticated", () => {
            beforeEach(() => {
                getters = {
                    isAuthenticated: () => true
                };
            });
            it("show logout button", async () => {
                const wrapper = setupWrapper();
                expect(wrapper.find("button").text()).toBe("Logout");
            });

            it("show only link, that navigates to main page <Posts>", async () => {
                const wrapper = setupWrapper();
                expect(wrapper.findAllComponents(RouterLinkStub).length).toBe(1);
                expect(wrapper.findComponent(RouterLinkStub).text()).toContain("Posts");
            });

        })
        describe("if not authenticated", () => {
            beforeEach(() => {
                getters = {
                    isAuthenticated: () => false
                };
            });
            it("show link to main page <Posts>", async () => {
                const wrapper = setupWrapper();
                expect(wrapper.findAllComponents(RouterLinkStub).at(0).text()).toBe("Posts");
            })
            it("show link to login form", async () => {
                const wrapper = setupWrapper();
                expect(wrapper.findAllComponents(RouterLinkStub).at(1).text()).toBe("Login");
            });
            it("not show <logout> button", async () => {
                const wrapper = setupWrapper();
                expect(wrapper.find("button").exists()).toBe(false);
            });
        })
    })
});
