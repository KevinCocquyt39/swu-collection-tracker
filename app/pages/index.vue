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
      </div>

      <table v-else class="card-table">
        <thead>
          <tr>
            <th>#</th>
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

    <AddCardModal v-model="showModal" @add="handleAdd" />
  </div>
</template>

<script setup lang="ts">
import { useCollection, useSettings } from '~/composables/useCollection'

definePageMeta({ layout: 'default' })

const { cards, loadFromStorage, addCard, removeCard, totalCards } = useCollection()
const { sortField, sortDirection, loadSettings } = useSettings()

const showModal = ref(false)

onMounted(() => {
  loadFromStorage()
  loadSettings()
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

function handleAdd(name: string, quantity: number) {
  addCard(name, quantity)
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
</script>
