import { shallowMount, createLocalVue } from "@vue/test-utils";
import Vuex from "vuex";
import LoginForm from "./LoginForm.vue";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("LoginForm.vue", () => {
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
    return shallowMount(LoginForm, { store, localVue });
  };

  beforeEach(() => {
    getters = {
      isAuthenticated: () => false
    };
    actions = {
      login: jest.fn().mockResolvedValue(true)
    };
  });

  describe("form submit", () => {
    describe("if authenticated", () => {
      beforeEach(() => {
        getters = {
          isAuthenticated: () => true
        };
      });
      it("shows a logged in info messaged", async () => {
        const wrapper = setupWrapper();
        expect(wrapper.find(".info").text()).toContain(
          "Successfully logged in!"
        );
      });
    });
    describe("if not authenticatd", () => {
      const login = async wrapper => {
        wrapper.find("input#email").setValue("somebody@example.org");
        wrapper.find("input#password").setValue("12341234");
        await wrapper.find("form").trigger("submit");
      };

      it("shows no error", async () => {
        const wrapper = setupWrapper();
        await login(wrapper);
        expect(wrapper.find(".error").exists()).toBe(false);
      });

      describe("when credentials are wrong", () => {
        beforeEach(() => {
          actions.login = jest.fn().mockResolvedValue(false);
        });

        it("shows wrong credentials error", async () => {
          const wrapper = setupWrapper();
          await login(wrapper);
          await localVue.nextTick();
          expect(wrapper.find(".error").text()).toContain(
            "Incorrect email/password!"
          );
        });
      });

      describe("in case of any other error", () => {
        beforeEach(() => {
          actions.login = jest.fn().mockRejectedValue(new Error("Ouch!"));
        });

        it("shows friendly error message", async () => {
          const wrapper = setupWrapper();
          await login(wrapper);
          await localVue.nextTick();
          expect(wrapper.find(".error").text()).toContain(
            "Internal ERROR: Something went wrong!"
          );
        });
      });
    });
  });
});
