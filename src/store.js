import { writable } from 'svelte/store';
import { browser } from "$app/environment"

export const ganttDataStore = writable({});
export const newOrEditResourceStore = writable('new');
export const resourceOptionsModalStore = writable(false);
export const resourceOptionsPageStore = writable('type');
export const resourceOptionsForm = writable({
    id: null,
    selectedName: null,
    selectedLabel: null,
    selectedCategory: null,
    selectedGallons: null,
    selectedManpower: null,
    selectedMixTimes: null,
    selectedPumpRates: null,
    selectedFillRates: null,
    selectedPumpToLines: null,
    selectedHeaderHtml: null,
    selectedClasses: null,
});
export const productStore = writable({});
export const zipStore = writable(0);