import NewsList from "@/components/NewsList.vue";
import NewsItem from "@/components/NewsItem.vue";
import { shallowMount , createLocalVue, mount} from "@vue/test-utils";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("NewsList.vue", () => {
  let actions;
  let getters;
  let store;
  
  const setupWrapper = () => {
    const m_news = [
      { title: "A", votes: 0, id: 1 },
      { title: "B", votes: 1, id: 2 },
      { title: "C", votes: 2, id: 3 },
    ];
    store = new Vuex.Store({
      modules: {
        auth: {
          namespaced: true,
          state: () => ({
            currentUser: null,
            token: null
          }),
          actions,
          getters, 
        }
      }
    });
    return mount(NewsList, { store, data(){
      return {
        posts: m_news
      }
    },
      localVue });
  };
  beforeEach(() => {
    getters = {
      isAuthenticated: () => false
    };
    
  });
  describe("empty", () => {
    it("render empty state", () => {
      const wrapper = shallowMount(NewsList, {
        data() {
          return {
            posts: []
          };
        },
      });
      expect(wrapper.find(".emptyList").exists()).toBeTruthy();
    });
  });

  describe("not empty", () => {
    it("render <NewsItem> for each item", () => {
      const wrapper = shallowMount(NewsList, {
        data() {
          return {
            posts:
              [{ title: "Vuejs", votes: 0, id: 0, author: { id: 1 } },
              { title: "Vuejs", votes: 0, id: 1, author: { id: 0 } }]
          };
        },
      });
      expect(wrapper.findAllComponents(NewsItem).length).toBe(2);
    }),
      it("not render empty placeholder", () => {
        const wrapper = shallowMount(NewsList, {
          data() {
            return {
              posts: [{ title: "Vuejs", votes: 0, id: 0, author: { id: 1 } },
              ]
            };
          },
        });
        expect(wrapper.find(".emptyList").exists()).toBeFalsy();
      });

    describe('click "Reverse order"', () => {
      it("toggles between ascending and descending order", async () => {
        const wrapper = setupWrapper();
        let newsWrapper = wrapper
          .findAllComponents(NewsItem)
          .wrappers.map((w) => w.find("h2").text());
        expect(newsWrapper).toEqual(["C(2)", "B(1)", "A(0)"]);

        const input = wrapper.find("#reverseButton");
        await input.trigger("click");

        newsWrapper = wrapper
          .findAllComponents(NewsItem)
          .wrappers.map((w) => w.find("h2").text());
        expect(newsWrapper).toEqual(["A(0)", "B(1)", "C(2)"]);
      });
    });
  });
})
