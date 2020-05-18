import React, { useEffect, useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import './index.css'

function App() {
  const [preview, setPreview] = useState([])
  
  const { register, control, handleSubmit, setValue, getValues, watch } = useForm({
    defaultValues: {
      photos: []
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'photos'
  })
  
  // For some reason, setting an initial default value for a file input causes an error.
  // Instead, this hook ensures that there is at least one input.
  useEffect(() => {
    if (fields.length < 1) {
      append([{ file: {} }])
    }
  })

  useEffect(() => {
    console.log('Value of preview', preview)
  }, [preview])

  const photos = watch('photos')

  useEffect(() => {
    console.log('Variable photos', photos)
    console.log('Length of photos', photos.length)
  }, [photos, getValues])

  const handleUpload = (e, index) => {
    const files = [...e.target.files]
    console.log()

    // Append must to be triggered only once per render? Not sure why, but it can't be triggered in the for loop.
    append([...files])
  
    files.forEach(function(file, fileIndex) {
      console.log('fileIndex:', fileIndex)
      console.log('file:', file)
      console.log('Type of file:', typeof(file))

      setValue(`photos[${index}]`, e.target.files)

      /*
      // Update the preview
      var urlList = preview
      urlList[index + fileIndex] = window.URL.createObjectURL(file)
      console.log('URL list:', urlList)  */
    })

    // setPreview(urlList)
  }

  const deletePhoto = (index) => {
    // Update the preview
    let urlList = preview
    urlList.splice(index, 1)
    console.log('URL list:', urlList)
    setPreview(urlList)
    
    remove(index)
  }

  const onSubmit = data => console.log('data', data)

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        {fields.map((item, index) => (
          preview[index] ? (<div key={item.id}>
            <img height='160' width='160' src={preview[index]} alt='preview' />
            <button type='button' onClick={() => deletePhoto(index)}>
              Delete
            </button>
          </div>)
          : (<div key={item.id}>
            <label htmlFor={`photos[${index}]`} className='custom-file-upload'>
              <input
                type='file'
                id={`photos[${index}]`}
                name={`photos[${index}]`}
                multiple
                onChange={(e) => handleUpload(e, index)}
                ref={register()}
              />
              <span> Attach </span>
            </label>
            <button type='button' onClick={() => remove(index)}>
              Delete
            </button>
          </div>
        )))}
        <button type='submit'>Submit</button>
      </form>
      <button
        type='button'
        onClick={() => {
          append([{ file: {} }])
        }}
      >
        append
      </button>
    </>
  )
}

export default App
