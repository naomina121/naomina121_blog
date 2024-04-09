const MainToc = () => {
  return (
    <div className='p-0 m-0 my-auto main-toc-container'>
      <input type='checkbox' id='mainToc' />
      <span>この記事の目次</span>
      <label htmlFor='mainToc'></label>
      <div className='main-toc'></div>
    </div>
  )
}

export default MainToc
