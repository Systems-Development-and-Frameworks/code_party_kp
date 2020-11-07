import NewsItem from "../components/NewsItem.vue";
//import { action, decorate } from '@storybook/addon-actions'

export default {
    title: 'NewsItem',
    component: NewsItem,
    argTypes: { onClick: { action: 'update' } },
  };
  
  export const Default = (args, /*{argTypes}*/) => ({
      components: {NewsItem}, 
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
  