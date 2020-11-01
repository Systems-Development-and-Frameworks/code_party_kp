import { shallowMount } from '@vue/test-utils'
import NewsList from '@/components/NewsList.vue'

describe('NewsList.vue', () => {
    it('render empty state', () => {
        const news = []
        const wrapper = shallowMount(NewsList, {
            propsData: { news: news }
        })
        expect(wrapper.find(".newslist_container").find("#list").text()).toMatch("List is empty.")
    })
})