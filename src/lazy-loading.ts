/**
 * Lazy loading utilities for large CSV datasets
 * Loads all data but renders progressively for performance
 */

export interface LazyLoadConfig {
	itemsPerPage: number;
	initialLoad: number;
	loadIncrement: number;
	scrollThreshold: number;
}

export const DEFAULT_LAZY_CONFIG: LazyLoadConfig = {
	itemsPerPage: 50,     // Items to show initially
	initialLoad: 50,      // First batch size
	loadIncrement: 25,    // Items to add per scroll
	scrollThreshold: 0.8  // Scroll percentage to trigger load
};

export class LazyLoader<T> {
	private data: T[] = [];
	private renderedData: T[] = [];
	private currentPage = 0;
	private config: LazyLoadConfig;
	private container: HTMLElement;
	private isLoading = false;
	private onRender: (items: T[], append: boolean) => void;
	private onLoadComplete?: () => void;

	constructor(
		container: HTMLElement,
		config: LazyLoadConfig = DEFAULT_LAZY_CONFIG,
		onRender: (items: T[], append: boolean) => void,
		onLoadComplete?: () => void
	) {
		this.container = container;
		this.config = config;
		this.onRender = onRender;
		this.onLoadComplete = onLoadComplete;
		
		this.setupScrollListener();
	}

	/**
	 * Set the complete dataset (loads all but renders progressively)
	 */
	setData(data: T[]): void {
		this.data = data;
		this.renderedData = [];
		this.currentPage = 0;
		this.renderInitialBatch();
	}

	/**
	 * Get the complete dataset (for operations like sorting)
	 */
	getAllData(): T[] {
		return [...this.data];
	}

	/**
	 * Get currently rendered data
	 */
	getRenderedData(): T[] {
		return [...this.renderedData];
	}

	/**
	 * Sort the complete dataset and re-render
	 */
	sortData(compareFn: (a: T, b: T) => number): void {
		this.data.sort(compareFn);
		this.renderedData = [];
		this.currentPage = 0;
		this.renderInitialBatch();
	}

	/**
	 * Filter the complete dataset and re-render
	 */
	filterData(filterFn: (item: T) => boolean): void {
		this.data = this.data.filter(filterFn);
		this.renderedData = [];
		this.currentPage = 0;
		this.renderInitialBatch();
	}

	/**
	 * Render initial batch of items
	 */
	private renderInitialBatch(): void {
		const initialBatch = this.getNextBatch(this.config.initialLoad);
		if (initialBatch.length > 0) {
			this.renderedData = [...initialBatch];
			this.onRender(initialBatch, false);
			
			// Schedule background loading of remaining items
			this.scheduleBackgroundLoading();
		}
		
		if (this.onLoadComplete && this.renderedData.length === this.data.length) {
			this.onLoadComplete();
		}
	}

	/**
	 * Get the next batch of items
	 */
	private getNextBatch(count: number): T[] {
		const start = this.currentPage * this.config.itemsPerPage;
		const end = start + count;
		const batch = this.data.slice(start, Math.min(end, this.data.length));
		
		if (batch.length > 0) {
			this.currentPage++;
		}
		
		return batch;
	}

	/**
	 * Load more items when scrolling
	 */
	private loadMore(): void {
		if (this.isLoading || this.renderedData.length >= this.data.length) {
			return;
		}

		this.isLoading = true;
		
		// Use requestAnimationFrame for smooth loading
		requestAnimationFrame(() => {
			const nextBatch = this.getNextBatch(this.config.loadIncrement);
			
			if (nextBatch.length > 0) {
				this.renderedData.push(...nextBatch);
				this.onRender(nextBatch, true);
			}
			
			this.isLoading = false;
			
			if (this.onLoadComplete && this.renderedData.length === this.data.length) {
				this.onLoadComplete();
			}
		});
	}

	/**
	 * Background loading of remaining items (non-blocking)
	 */
	private scheduleBackgroundLoading(): void {
		if (this.renderedData.length >= this.data.length) {
			return;
		}

		// Load remaining items progressively in background
		const loadNextChunk = () => {
			if (this.renderedData.length < this.data.length) {
				const nextBatch = this.getNextBatch(this.config.loadIncrement);
				
				if (nextBatch.length > 0) {
					this.renderedData.push(...nextBatch);
					this.onRender(nextBatch, true);
				}

				// Continue loading in next frame
				if (this.renderedData.length < this.data.length) {
					requestAnimationFrame(loadNextChunk);
				} else if (this.onLoadComplete) {
					this.onLoadComplete();
				}
			}
		};

		// Start background loading after a short delay
		setTimeout(() => requestAnimationFrame(loadNextChunk), 100);
	}

	/**
	 * Setup scroll listener for progressive loading
	 */
	private setupScrollListener(): void {
		const onScroll = () => {
			const scrollTop = this.container.scrollTop;
			const scrollHeight = this.container.scrollHeight;
			const clientHeight = this.container.clientHeight;

			const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;

			if (scrollPercentage >= this.config.scrollThreshold) {
				this.loadMore();
			}
		};

		// Throttle scroll events
		let scrollTimeout: NodeJS.Timeout;
		this.container.addEventListener('scroll', () => {
			clearTimeout(scrollTimeout);
			scrollTimeout = setTimeout(onScroll, 50);
		});
	}

	/**
	 * Force load all remaining items
	 */
	loadAll(): void {
		if (this.renderedData.length < this.data.length) {
			const remaining = this.data.slice(this.renderedData.length);
			this.renderedData.push(...remaining);
			this.onRender(remaining, true);
			
			if (this.onLoadComplete) {
				this.onLoadComplete();
			}
		}
	}

	/**
	 * Get loading status
	 */
	getStatus() {
		return {
			totalItems: this.data.length,
			renderedItems: this.renderedData.length,
			isLoading: this.isLoading,
			progress: this.data.length > 0 ? this.renderedData.length / this.data.length : 0
		};
	}

	/**
	 * Cleanup
	 */
	destroy(): void {
		// Remove event listeners and cleanup
		this.container.removeEventListener('scroll', () => {});
		this.data = [];
		this.renderedData = [];
	}
}