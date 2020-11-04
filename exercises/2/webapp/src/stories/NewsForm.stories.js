//import { action, decorate } from '@storybook/addon-actions'
export default {
    title: 'NewsForm',
  };
  
  export const Default = (/*args, {argTypes}*/) => ({
      template: '<form @submit.prevent> <input aria-label="title" v-model="newTitle" /> <button @click="create">Create</button> </form>',
  })
  