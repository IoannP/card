<template>
  <div class="w-100 h-50 d-flex flex-column">
    <p class="fs-4 mt-2 mb-2">
      Card template
    </p>
    <codemirror
      v-model="model"
      placeholder="Type html here..."
      :indent-with-tab="true"
      :tab-size="2"
      :extensions="extensions"
      :style="editorStyles"
    />
  </div>
</template>

<script setup>
import { Codemirror } from 'vue-codemirror';

defineProps({
  placeholder: {
    type: String,
    default: 'Type code here...'
  },
  extensions: {
    type: Array,
    default: () => ([]),
  },
  editorStyles: {
    type: Object,
    default: () => ({}),
  },
  title: {
    type: String,
    default: 'Edit code',
  }
});

const model = defineModel({ required: true, type: String, default: '' });
</script>