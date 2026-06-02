<template>
  <div>
    <div class="page-title">Collection</div>
    <div class="page-subtitle">// galactic_inventory · unit_count: {{ totalCards }}</div>
    <div class="section-divider" />

    <div class="collection-toolbar">
      <div class="collection-stats">
        <span>{{ cards.length }}</span> unique cards &nbsp;·&nbsp;
        <span>{{ totalCards }}</span> total copies
      </div>
      <button class="btn btn-primary" @click="showModal = true">
        <span>+</span> Add Card
      </button>
    </div>

    <div class="glass-panel">
      <div class="corner-tl" />
      <div class="corner-br" />

      <div v-if="sortedCards.length === 0" class="empty-state">
        <span class="empty-state-icon">🌌</span>
        <div class="empty-state-title">No cards logged</div>
        <div class="empty-state-text">Begin your collection by adding a card above</div>
        <div v-if="exampleNames.length" class="empty-state-examples">
          <div class="empty-state-examples-label">// example cards from the galaxy</div>
          <div class="empty-state-examples-list">
            <button
              v-for="name in exampleNames"
              :key="name"
              class="example-pill"
              @click="openWithExample(name)"
            >{{ name }}</button>
          </div>
        </div>
      </div>

      <div v-else class="table-scroll">
      <table class="card-table">
        <thead>
          <tr>
            <th>#</th>
            <th></th>
            <th>Card Name</th>
            <th>Qty</th>
            <th>Added</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(card, index) in sortedCards" :key="card.id">
            <td>
              <span style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted)">
                {{ String(index + 1).padStart(3, '0') }}
              </span>
            </td>
            <td class="thumb-cell">
              <img v-if="card.photo" :src="card.photo" alt="" class="card-thumb" />
              <span v-else class="card-thumb-empty">—</span>
            </td>
            <td><span class="card-name">{{ card.name }}</span></td>
            <td><span class="card-qty">×{{ card.quantity }}</span></td>
            <td><span class="card-date">{{ formatDate(card.addedAt) }}</span></td>
            <td>
              <button class="btn btn-danger" style="padding: 0.35rem 0.7rem; font-size: 0.55rem;" @click="removeCard(card.id)">
                Remove
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      </div>
    </div>

    <AddCardModal v-model="showModal" :initial-name="selectedExample" @add="handleAdd" />
  </div>
</template>

<script setup lang="ts">
import { useCollection, useSettings } from '~/composables/useCollection'

definePageMeta({ layout: 'default' })

const { cards, loadFromStorage, addCard, removeCard, totalCards } = useCollection()
const { sortField, sortDirection, loadSettings } = useSettings()

const showModal = ref(false)
const selectedExample = ref('')
const exampleNames = ref<string[]>([])

function openWithExample(name: string) {
  selectedExample.value = name
  showModal.value = true
}

onMounted(async () => {
  loadFromStorage()
  loadSettings()
  try {
    const data = await $fetch<{ names: string[] }>('/api/sw-characters')
    exampleNames.value = data.names
  } catch {
    // non-critical — silently ignore if the fetch fails
  }
})

const sortedCards = computed(() => {
  return [...cards.value].sort((a, b) => {
    let result = 0
    if (sortField.value === 'name') {
      result = a.name.localeCompare(b.name)
    } else if (sortField.value === 'quantity') {
      result = a.quantity - b.quantity
    } else {
      result = new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime()
    }
    return sortDirection.value === 'asc' ? result : -result
  })
})

function handleAdd(name: string, quantity: number, photo?: string) {
  addCard(name, quantity, photo)
  selectedExample.value = ''
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
</script>

<style scoped>
.thumb-cell {
  width: 40px;
  text-align: center;
}

.card-thumb {
  width: 36px;
  height: 36px;
  object-fit: cover;
  border-radius: 3px;
  border: 1px solid var(--border);
  display: block;
}

.card-thumb-empty {
  color: var(--text-muted);
  font-size: 0.7rem;
}

.table-scroll {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.empty-state-examples {
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.empty-state-examples-label {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

.empty-state-examples-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.example-pill {
  background: transparent;
  border: 1px solid var(--border);
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.6rem;
  padding: 0.3rem 0.75rem;
  border-radius: 2px;
  cursor: pointer;
  transition: border-color 0.15s, color 0.15s;
  letter-spacing: 0.03em;
}

.example-pill:hover {
  border-color: var(--accent);
  color: var(--accent);
}
</style>
