import { action, makeAutoObservable } from 'mobx';

export class AppStore {
    constructor() {
        makeAutoObservable(this);
    }

    loading: boolean = false;

    @action setLoading(loading: boolean) {
        this.loading = loading;
    }
}

export default new AppStore();
