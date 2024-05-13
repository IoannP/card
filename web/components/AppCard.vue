<template>
  <div class="d-flex justify-content-center align-items-center w-100 h-100">
    <article v-if="isTemplateLoaded">
      <component
        :is="customComponent"
        v-if="isCustomComponent" 
      />
      <div
        v-else
        class="card"
      >
        <img
          :src="cardData.url" 
          class="card-img-top"
        >
        <div class="card-body">
          <h3>{{ cardData.title }}</h3>
          <p class="card-text">
            {{ cardData.text }}
          </p>
        </div>
      </div>
    </article>
    <Loader v-else />
  </div>
</template>

<script setup>
import { defineComponent, ref } from 'vue'
import Loader from './AppLoader.vue';

const isTemplateLoaded = ref(false);
const isCustomComponent = ref(false);
const cardData = ref({ title: '', text: '', url: '' });

const setupComponent = (template) => defineComponent({
  data: () => ({ cardData }),
  template: template, 
});
let customComponent = setupComponent();

const loadCardData = async () => {
  isTemplateLoaded.value = false;

  await fetch('http://localhost:3000/data')
    .then((response) => response.json())
    .then((data) => {
      cardData.value = data;
    })
    .catch((error) => console.error('Error during load card data: ', error.message));

  await fetch('http://localhost:3000/settings')
    .then((response) => response.json())
    .then(async (data) => {
      const { template = '', styles } = data;

      isCustomComponent.value = template.length > 0;
      customComponent = setupComponent(template);

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
