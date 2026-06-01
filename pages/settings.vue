<template>
  <div>
    <div class="page-title">Settings</div>
    <div class="page-subtitle">// system_configuration · persistence: local_storage</div>
    <div class="section-divider" />

    <div class="settings-grid">
      <div class="glass-panel settings-section">
        <div class="corner-tl" />
        <div class="corner-br" />

        <div class="settings-section-title">Sort Configuration</div>

        <div class="settings-row">
          <div class="settings-row-label">
            <strong>Sort By</strong>
            <small>Primary field used to order the collection list</small>
          </div>
          <div class="settings-row-control">
            <select v-model="localSortField" class="form-select">
              <option value="name">Card Name</option>
              <option value="quantity">Quantity</option>
              <option value="addedAt">Date Added</option>
            </select>
          </div>
        </div>

        <div class="settings-row">
          <div class="settings-row-label">
            <strong>Sort Direction</strong>
            <small>Ascending or descending order</small>
          </div>
          <div class="settings-row-control">
            <select v-model="localSortDirection" class="form-select">
              <option value="asc">Ascending ↑</option>
              <option value="desc">Descending ↓</option>
            </select>
          </div>
        </div>
      </div>

      <div class="glass-panel settings-section">
        <div class="corner-tl" />
        <div class="corner-br" />

        <div class="settings-section-title">Data Management</div>

        <div class="settings-row">
          <div class="settings-row-label">
            <strong>Clear Collection</strong>
            <small>Permanently remove all cards from local storage</small>
          </div>
          <div class="settings-row-control" style="text-align: right;">
            <button class="btn btn-danger" @click="confirmClear">
              Purge Data
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="settings-actions">
      <NuxtLink to="/" class="btn btn-ghost">← Back to Collection</NuxtLink>
      <button class="btn btn-primary" @click="save">
        <span>⬡</span> Save Settings
      </button>
    </div>

    <Transition name="fade">
      <div v-if="showToast" class="save-toast">
        ✓ Settings saved to local storage
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { SortField, SortDirection } from '~/composables/useCollection'
import { useSettings, useCollection } from '~/composables/useCollection'

definePageMeta({ layout: 'default' })

const { sortField, sortDirection, loadSettings, saveSettings } = useSettings()
const { cards, loadFromStorage } = useCollection()

const localSortField = ref<SortField>('addedAt')
const localSortDirection = ref<SortDirection>('desc')
const showToast = ref(false)

onMounted(() => {
  loadSettings()
  loadFromStorage()
  localSortField.value = sortField.value
  localSortDirection.value = sortDirection.value
})

function save() {
  sortField.value = localSortField.value
  sortDirection.value = localSortDirection.value
  saveSettings()
  showToast.value = true
  setTimeout(() => { showToast.value = false }, 2200)
}

function confirmClear() {
  if (confirm('Purge all collection data from local storage? This cannot be undone.')) {
    cards.value = []
    if (import.meta.client) {
      localStorage.removeItem('swu_collection')
    }
  }
}
</script>
