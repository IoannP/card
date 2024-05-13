<template>
  <div class="container justify-content-center align-items-center position-relative min-vh-100">
    <div class="w-50 h-75 me-5 d-flex flex-column justify-content-between">
      <!--begin::Editor-->
      <div class="w-100 h-50 d-flex flex-column">
        <p class="fs-4">Card template</p>
        <codemirror
          v-model="data.template"
          placeholder="Type html here..."
          :indent-with-tab="true"
          :tab-size="2"
          :extensions="templateExtensions"
          :style="editorsStyles"
        />
      </div>
      <!--end::Editor-->

      <!--begin::Editor-->
      <div class="w-100 h-50 d-flex flex-column">
        <p class="fs-4">Card styles</p>
        <codemirror
          v-model="data.styles"
          placeholder="Type css here..."
          :indent-with-tab="true"
          :tab-size="2"
          :extensions="styleExtensions"
          :style="editorsStyles"
        />
      </div>
      <!--end::Editor-->

      <!--begin::Actions-->
      <button
        class="btn btn-lg btn-primary ms-auto mt-2"
        @click="onSubmit"
        :disabled="isButtonDisabled"
      >
        <span v-if="isButtonDisabled" class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
        <span>Save</span>
      </button>
      <!--end::Actions-->
    </div>

    <!--begin::Card-->
    <div class="w-50 h-75">
      <Card ref="cardRef"/>
    </div>
    <!--end::Card-->

    <!--begin::Notifications-->
    <div v-if="isActiveSuccessNotice" class="alert alert-success position-absolute top-0 start-50 mt-5 translate-middle" role="alert">
      Card styles and templated updated successfully!
    </div>
    <div v-if="isActiveErrorNotice" class="alert alert-danger position-absolute top-0 start-50 mt-5 translate-middle" role="alert">
      Error during update card styles and templated: {{ errorMessage }}
    </div>
    <!--end::Notifications-->
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

import { Codemirror } from 'vue-codemirror';
import { html } from '@codemirror/lang-html'
import { css } from '@codemirror/lang-css';
import { oneDark } from '@codemirror/theme-one-dark';

import Card from '../../components/Card.vue';

const templateExtensions = [html(), oneDark];
const styleExtensions = [css(), oneDark];

const data = reactive({
  template: '',
  styles: ''
});

const cardRef = ref(null);
const isButtonDisabled = ref(false);
const isActiveSuccessNotice = ref(false);
const isActiveErrorNotice = ref(false);
const errorMessage = ref('');

const editorsStyles = ref({ height: '100%', width: '100%' });

const notice = (isMessageActive) => {
  isMessageActive.value = true;
  setTimeout(() => {
    isMessageActive.value = false;
  }, 5000);
};

const onSubmit = () => {
  isButtonDisabled.value = true;
  fetch('http://localhost:3000/settings', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then((res) => {
    const { status, statusText } = res;
    errorMessage.value = statusText

    if (status < 200 || status >= 300) {
      console.error('Error during update card styles and templated: ', res);
      notice(isActiveErrorNotice);
    } else {
      notice(isActiveSuccessNotice)
    }
  })
  .catch((error) => {
    errorMessage.value = error.message;
    console.error('Error during update card styles and templated: ', error);
    notice(isActiveErrorNotice);
  })
  .finally(() => {
    isButtonDisabled.value = false;
    cardRef.value.loadCardData();
  });
};

fetch('http://localhost:3000/settings')
  .then((response) => response.json())
  .then(({ template, styles }) => {
    data.template = template || '';
    data.styles = styles || '';
  })
  .catch((error) => console.error('Error during load card data: ', error));
</script>

<style lang="scss">
@import "bootstrap/scss/bootstrap";

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  height: 100vh;
}
</style>