import { shallowMount } from "@vue/test-utils";
import NewsList from "@/components/NewsList.vue";
import News from "@/components/News.vue";

describe("empty", () => {
  it("render empty state", () => {
    const wrapper = shallowMount(NewsList, {
      data() {
        return { news: [] };
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
          news: [
            { title: "A", votes: 0, id: 1 },
            { title: "B", votes: 1, id: 2 },
          ],
        };
      },
    });
    expect(wrapper.findAllComponents(News).length).toBe(2);
  }),
    it("not render empty placeholder", () => {
      const wrapper = shallowMount(NewsList, {
        data() {
          return { news: [{ title: "Vuejs", votes: 0 }] };
        },
      });
      expect(wrapper.find(".emptyList").exists()).toBeFalsy();
    });

  describe('click "Reverse order"', () => {
    it("toggles between ascending and descending order", () => {
      const news = [
        { title: "A", votes: 0, id: 1 },
        { title: "B", votes: 1, id: 2 },
        { title: "C", votes: 2, id: 3 },
      ];
      const wrapper = shallowMount(NewsList, {
        data() {
          return { news: news };
        },
      });
      const input = wrapper.find("#reverseButton");
      input.trigger("click");
      expect(wrapper.findAllComponents(News).at(0).vm.$props.news).toBe(
        news[2]
      );
      expect(wrapper.findAllComponents(News).at(2).vm.$props.news).toBe(
        news[0]
      );
      expect(wrapper.findAllComponents(News).at(1).vm.$props.news).toBe(
        news[1]
      );
    });
  });
});