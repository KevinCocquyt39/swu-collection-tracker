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

          <div class="form-group">
            <label class="form-label">Photo</label>
            <div class="photo-row">
              <button type="button" class="btn btn-ghost photo-btn" :disabled="capturing" @click="takePhoto">
                <span>📷</span> {{ form.photo ? 'Retake' : 'Take Photo' }}
              </button>
              <button v-if="form.photo" type="button" class="btn btn-ghost photo-btn" @click="form.photo = undefined">
                ✕ Remove
              </button>
            </div>
            <div v-if="form.photo" class="photo-preview-wrap">
              <img :src="form.photo" alt="Card photo preview" class="photo-preview" />
            </div>
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
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'

const props = defineProps<{
  modelValue: boolean
  initialName?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'add': [name: string, quantity: number, photo?: string]
}>()

const nameInput = ref<HTMLInputElement | null>(null)
const capturing = ref(false)

const form = reactive({
  name: '',
  quantity: 1,
  photo: undefined as string | undefined
})

watch(() => props.modelValue, (open) => {
  if (open) {
    form.name = props.initialName ?? ''
    form.quantity = 1
    form.photo = undefined
    nextTick(() => nameInput.value?.focus())
  }
})

async function takePhoto() {
  capturing.value = true
  try {
    const image = await Camera.getPhoto({
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Prompt,
      quality: 60,
      width: 600,
      correctOrientation: true,
    })
    form.photo = image.dataUrl ?? undefined
  } catch {
    // user cancelled or permission denied — do nothing
  } finally {
    capturing.value = false
  }
}

function submit() {
  if (!form.name.trim() || form.quantity < 1) return
  emit('add', form.name.trim(), form.quantity, form.photo)
  emit('update:modelValue', false)
}
</script>

<style scoped>
.photo-row {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.photo-btn {
  font-size: 0.65rem;
  padding: 0.4rem 0.8rem;
}

.photo-preview-wrap {
  margin-top: 0.6rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  overflow: hidden;
  max-width: 100%;
}

.photo-preview {
  display: block;
  width: 100%;
  max-height: 200px;
  object-fit: contain;
  background: #000;
}
</style>
