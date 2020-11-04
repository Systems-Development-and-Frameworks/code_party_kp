import { shallowMount } from '@vue/test-utils'
import NewsList from '@/components/NewsList.vue'

describe('empty', () => {
    it('render empty state', () => {
        const wrapper = shallowMount(NewsList, {
            data() {
                return { news: [] }
            }
        })
        expect(wrapper.find('.emptyList').exists()).toBeTruthy();
    })
})

describe('not empty', () => {
    it('render <NewsItem> for each item', () => {
        const wrapper = shallowMount(NewsList, {
            data() {
                return { news: [{ title: "Vuejs", votes: 0 }] }
            }
        })
        expect(wrapper.find('.emptyList').exists()).toBeFalsy();
    })

    describe('click "Reserve order"', () => {
        it('toggles between ascending and descending order', () => {
    
        })
    })
})





