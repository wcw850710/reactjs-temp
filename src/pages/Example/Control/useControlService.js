import { ExampleService } from '../useExampleService'
import { useContext, useRef, useCallback, useEffect } from 'react'
import exampleTypeEnum from '../../../enums/exampleTypeEnum'
import axios from 'axios'

function useControlService() {
	const { list, addList } = useContext(ExampleService)
	const state = useRef({
		id: list.length ? list[list.length - 1].id + 1 : 1,
		type: exampleTypeEnum.dog,
		name: '',
	})
	const nameRef = useRef(null)
	const onChange = key => ev => (state.current[key] = ev.target.value)
	const onCreate = useCallback(async () => {
		const { id, type, name } = state.current

		if (typeof name === 'string' && name.trim() === '') {
			return alert('勇者名稱不得為空')
		}

		let url = ''

		if (type === exampleTypeEnum.dog) {
			const res = await axios.get('https://dog.ceo/api/breeds/image/random')
			url = res.data.message
		} else if (exampleTypeEnum.cat) {
			const res = await axios.get('https://api.thecatapi.com/v1/images/search')
			url = res.data[0].url
		} else {
			return alert('必須為狗派或貓派')
		}

		addList({
			id,
			url,
			name,
			type,
		})

		state.current.id++
		if (nameRef.current) {
			nameRef.current.value = ''
			state.current.name = ''
		}
	}, [state.current])
	const onKeyDown = ev => ev.key === 'Enter' && onCreate()
	useEffect(() => {
		nameRef.current.focus()
	}, [nameRef.current])
	return {
		onChange,
		onKeyDown,
		onCreate,
		nameRef,
	}
}

export default useControlService