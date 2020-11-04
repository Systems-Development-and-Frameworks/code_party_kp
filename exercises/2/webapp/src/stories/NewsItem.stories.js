import News from "../components/News.vue";
//import { action, decorate } from '@storybook/addon-actions'

export default {
    title: 'NewsItem',
    component: News,
    argTypes: { onClick: { action: 'update' } },
  };
  
  export const Default = (args, /*{argTypes}*/) => ({
      components: {News}, 
      template: ' <News :news="news" @update="update" @remove="remove" />',
      props: {
        news: {
            default: ()=> args,
        }
      },
  }); 

  Default.args = {
    news: {
        id: 1,
        title: 'This control updates the component in real-time',
        votes: 42
    }
  }
  