import NewsForm from "../components/NewsForm.vue";
import { action } from "@storybook/addon-actions";

export default {
  title: "NewsForm",
  component: NewsForm,
};

const Template = (args, { argTypes }) => ({
  components: { NewsForm },
  template: ' <NewsForm v-bind="$props" @create="create"/>',
  props: Object.keys(argTypes),
  methods: { create: action("create") },
});

//makes a clone of the function
export const Default = Template.bind({});
