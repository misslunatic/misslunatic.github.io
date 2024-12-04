<script setup>
import { onMounted, watch, ref } from 'vue';
import { useRoute } from 'vue-router'
import fm from 'front-matter';
import markdownit from 'markdown-it'
import PostCard from '../components/PostCard.vue';
import hljs from 'highlight.js';

const md = markdownit({
	breaks: true,
	typographer: true,
	html: true,
    highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre><code class="hljs">' +
               hljs.highlight(str, { language: lang, ignoreIllegals: true }).value +
               '</code></pre>';
      } catch (__) {}
    }

    return '<pre><code class="hljs">' + md.utils.escapeHtml(str) + '</code></pre>';
  }
})


md.renderer.rules.hr = function(tokens, idx, options, env, self) {
	return '<div class="rounded-full h-0.5 bg-purple-500 my-3"></div>'
}

md.renderer.rules.softbreak = function(tokens, idx, options, env, self) {
	return '<br>'
}

md.renderer.rules.hardbreak = function(tokens, idx, options, env, self) {
	return '<br><br>'
}
onMounted(async () => {
    const modules = import.meta.glob('/blog/');

    for (const path in modules) {
        const module = await modules[path]();
        console.log(path, module.default); // module.default contains the image data
    }
});

const route = useRoute()

let urlParams = new URLSearchParams(window.location.search);

const url = ref(urlParams.get('post'));
url.value = urlParams.get('post')

const loading = ref(false)
const data = ref(null)
const text = ref(null)
const error = ref(null)

const background = ref('');
const title = ref(null);
const description = ref(null);
const date = ref(null);
const tags = ref(null);

// watch the params of the route to fetch the data again
watch(url, async () => {
    await fetchData(url.value)
}, {
    immediate: true 
});

async function fetchData(url) {
    error.value = data.value = null
    loading.value = true
    console.log(url)
    try {
        data.value = await (await fetch(url)).text()
        const processed = fm(data.value)
        text.value = md.render(processed.body)
        background.value = processed.attributes.background
        title.value = processed.attributes.title
        description.value = processed.attributes.description
        date.value = processed.attributes.date
        tags.value = processed.attributes.tags
    } catch (err) {
        error.value = err.toString()
        console.error(err)
        loading.value = false
    } finally {
        loading.value = false
    }
}

const list = ref([])
const tagList = ref([])
const tagFilter = ref([])

/* If tags are specified, include only posts with those tags */
/* else, include all posts */
async function fetchList() {
    const file_list = import.meta.glob('../../public/posts/blog/*.md', { as: 'raw' });

    console.log(file_list)
    for (const path in file_list) {
        // Trim off ../../public from the path
        const url = path.slice(12)

        // Ensure type is RAW data - Otherwise, invalid mime type occurs
        const text = await (await fetch(url)).text()
        const processed = fm(text)
        list.value.push({
            title: processed.attributes.title,
            description: processed.attributes.description,
            date: processed.attributes.date,
            tags: processed.attributes.tags,
            url: path
        })
        console.log(list.value)
    }

    // Extract one of every tag from the list
    list.value.forEach(post => {
        post.tags.forEach(tag => {
            if (!tagList.value.includes(tag)) {
                tagList.value.push(tag)
            }
        })
    })
}
fetchList()
</script>

<template>
    <div class="relative z-50 flex w-full justify-center text-white">
        <div class="mt-8 flex-col text-center">
            <div v-if="url == null">
                <h1>Blog</h1>
                <!-- Tag selection -->
                <div class="flex justify-center m-5">
                    <div v-for="tag in tagList" :key="tag" class="m-1 text-center">
                        <!-- If tag already clicked, highlight -->
                        <!-- Toggle, multiple -->
                        <div v-if="tagFilter.includes(tag)">
                            <button @click="tagFilter = tagFilter.filter(function(item) {
                                return item !== tag
                            })" class="text-xs transition bg-purple-500 hover:bg-purple-700 border-purple-400 border text-white p-1 rounded-md">{{ tag }}</button>
                        </div>
                        <div v-else>
                            <button @click="tagFilter.push(tag)" class="transition text-xs hover:bg-purple-700 bg-purple-900 border-purple-400 border text-white p-1 rounded-md">{{ tag }}</button>
                        </div>
                    </div>
                </div>
                <div v-for="post in list" :key="post.url">
                    <div v-if="tagFilter.length == 0 || tagFilter.some(tag => post.tags.includes(tag))">
                        <PostCard :url="post.url" />
                    </div>
                </div>
            </div>
            <div v-else>
                <div class="flex flex-col">
                    <h1>{{ title }}</h1>
                    <div class="max-w-50 flex flex-row justify-center">
                        <div v-for="tag in tags" :key="tag" class="m-1 text-center">
                            <span class="text-xs bg-purple-800 border-purple-400 border text-white p-1 rounded-md">{{ tag }}</span>
                        </div>
                    </div>
                    <div class="text-pretty min-w-96 text-left max-w-4xl mt-4 p-6 max-md:w-screen rounded-md container bg-opacity-90 bg-purple-900">
                        <div v-html=text></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>