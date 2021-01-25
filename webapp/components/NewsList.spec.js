import NewsList from "@/components/NewsList.vue";
import NewsItem from "@/components/NewsItem.vue";
import { createLocalVue, mount } from "@vue/test-utils";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("NewsList.vue", () => {
  const store = new Vuex.Store({
    modules: {
      auth: {
        namespaced: true,
        state: () => ({
          currentUser: null,
          token: null
        }),
        getters: { isAuthenticated: () => false, currentUser: () => undefined }
      }
    }
  });

  const setupWrapper = news => {
    return mount(NewsList, {
      store,
      data() {
        return {
          posts: news
        };
      },
      localVue
    });
  };

  describe("empty", () => {
    it("render empty state", () => {
      const wrapper = setupWrapper([]);
      expect(wrapper.find(".emptyList").exists()).toBeTruthy();
    });
  });

  describe("not empty", () => {
    const news = [
      { title: "A", votes: 0, id: 1, author: { id: 1 } },
      { title: "B", votes: 1, id: 2, author: { id: 1 } },
      { title: "C", votes: 2, id: 3, author: { id: 1 } }
    ];

    it("render <NewsItem> for each item", () => {
      const wrapper = setupWrapper(news);
      expect(wrapper.findAllComponents(NewsItem).length).toBe(3);
    }),
      it("not render empty placeholder", () => {
        const wrapper = setupWrapper(news);
        expect(wrapper.find(".emptyList").exists()).toBeFalsy();
      });

    describe('click "Reverse order"', () => {
      it("toggles between ascending and descending order", async () => {
        const wrapper = setupWrapper(news);
        let newsWrapper = wrapper
          .findAllComponents(NewsItem)
          .wrappers.map(w => w.find("h2").text());
        expect(newsWrapper).toEqual(["C(2)", "B(1)", "A(0)"]);

        const input = wrapper.find("#reverseButton");
        await input.trigger("click");

        newsWrapper = wrapper
          .findAllComponents(NewsItem)
          .wrappers.map(w => w.find("h2").text());
        expect(newsWrapper).toEqual(["A(0)", "B(1)", "C(2)"]);
      });
    });
  });
});
