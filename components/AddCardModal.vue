<template>
  <Transition name="fade">
    <div v-if="modelValue" class="modal-backdrop" @click.self="$emit('update:modelValue', false)">
      <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div class="corner-tl" />
        <div class="corner-br" />

        <button class="modal-close" @click="$emit('update:modelValue', false)" aria-label="Close">✕</button>

        <div class="modal-header">
          <div class="modal-title" id="modal-title">Acquire Card</div>
          <div class="modal-subtitle">// log new entry to collection database</div>
        </div>

        <form @submit.prevent="submit">
          <div class="form-group">
            <label class="form-label" for="card-name">Card Name</label>
            <input
              id="card-name"
              ref="nameInput"
              v-model="form.name"
              class="form-input"
              type="text"
              placeholder="e.g. Luke Skywalker"
              required
              autocomplete="off"
              maxlength="120"
            />
          </div>

          <div class="form-group">
            <label class="form-label" for="card-qty">Quantity</label>
            <input
              id="card-qty"
              v-model.number="form.quantity"
              class="form-input"
              type="number"
              min="1"
              max="999"
              placeholder="1"
              required
            />
          </div>

          <div class="modal-footer">
            <button type="button" class="btn btn-ghost" @click="$emit('update:modelValue', false)">
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" :disabled="!form.name.trim() || form.quantity < 1">
              <span>⬡</span> Add to Collection
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'add': [name: string, quantity: number]
}>()

const nameInput = ref<HTMLInputElement | null>(null)

const form = reactive({
  name: '',
  quantity: 1
})

watch(() => props.modelValue, (open) => {
  if (open) {
    form.name = ''
    form.quantity = 1
    nextTick(() => nameInput.value?.focus())
  }
})

function submit() {
  if (!form.name.trim() || form.quantity < 1) return
  emit('add', form.name.trim(), form.quantity)
  emit('update:modelValue', false)
}
</script>
