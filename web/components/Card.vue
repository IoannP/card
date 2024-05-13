<template>
  <div class="d-flex justify-content-center align-items-center w-100 h-100">
    <article v-if="isTemplateLoaded">
      <component v-if="isCustomComponent" :is="customComponent"/>
      <div
        v-else
        class="card"
      >
        <img :src="cardData.url" class="card-img-top">
        <div class="card-body">
          <h3>{{ cardData.title }}</h3>
          <p class="card-text">{{ cardData.text }}</p>
        </div>
      </div>
    </article>
    <Loader v-else />
  </div>
</template>

<script setup>
import { reactive, ref, defineComponent } from 'vue'
import Loader from './Loader.vue';

const isTemplateLoaded = ref(false);
const isCustomComponent = ref(false);
const cardData = reactive({
  title: '',
  text: '',
  url: ''
});

const customComponent = defineComponent({ template: '', data: () => ({ cardData }) });

const loadCardData = async () => {
  isTemplateLoaded.value = false;

  await fetch('http://localhost:3000/data')
    .then((response) => response.json())
    .then((data) => {
      cardData.title = data.title;
      cardData.text = data.text;
      cardData.url = data.url;
    })
    .catch((error) => console.error('Error during load card data: ', error.message));

  await fetch('http://localhost:3000/settings')
    .then((response) => response.json())
    .then((data) => {
      const { template = '', styles } = data;

      isCustomComponent.value = template.length > 0;
      customComponent.template = template;

      let styleElement = document.getElementById('card-styles');
      if (styleElement) {
        styleElement.remove();
      }

      if (styles.length > 0) {
        styleElement = document.createElement('style');
        styleElement.id = 'card-styles';
        styleElement.type = 'text/css';
        styleElement.textContent = data.styles;
        document.head.appendChild(styleElement); 
      }
    })
    .catch((error) => console.error('Error during load card template settings: ', error));

    isTemplateLoaded.value = true;
};

loadCardData();

defineExpose({ loadCardData });
</script>
