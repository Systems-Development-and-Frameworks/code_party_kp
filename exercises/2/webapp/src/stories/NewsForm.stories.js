import News from "../components/News.vue";
import { linkTo } from '@storybook/addon-links'
import { action, decorate } from '@storybook/addon-actions'

export default {
    title: 'NewsForm',
   // component: News,
  };
  const news = {
      id: 1,
      title: 'This control updates the component in real-time',
      votes: 42
  }
  export const Default = () => ({
    //  components: {News}, 
      template: '<form @submit.prevent> <input aria-label="title" v-model="newTitle" /> <button @click="create">Create</button> </form>',
  })
  