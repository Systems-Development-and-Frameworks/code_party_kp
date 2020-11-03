import { mount, shallowMount } from '@vue/test-utils'
import NewsList from '@/components/NewsList.vue'

describe('NewsList.vue', () => {
    it('render empty state', () => {
       const wrapper = shallowMount(NewsList, {
           data() {
               return {news: []}
           }
       })
       expect(wrapper.find('.emptyList').exists()).toBeTruthy();
    })

    it('renders <NewsItem> for each item', () => {
        const news = [{ title: "VueJs", votes: 0, id: 1 }, { title: "just", votes: 0, id: 2 }, { title: "rocks", votes: 0, id: 3 }]
        const wrapper = mount(NewsList)
        expect(wrapper.vm.newsSorted).toEqual(news)
    })

    //TODO: click "Reverse order" toggles between ascending and descending order

})