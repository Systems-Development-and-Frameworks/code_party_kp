import NewsItem from "../components/NewsItem.vue";
import { action } from "@storybook/addon-actions";

export default {
  title: "NewsItem",
  component: NewsItem,
};

const Template = (args, { argTypes }) => ({
  components: { NewsItem },
  template: ' <NewsItem v-bind="$props" @update="update" @remove="remove"/>',
  props: Object.keys(argTypes),
  methods: { update: action("update"), remove: action("remove") },
});

//makes a clone of the function
export const Default = Template.bind({});
Default.args = {
  news: {
    id: 1,
    title: "This control updates the component in real-time",
    votes: 42,
  },
};
