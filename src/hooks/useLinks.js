import { useGlobalStore } from '../store/global'

const initialState = useGlobalStore(state => state.globalLinks)
