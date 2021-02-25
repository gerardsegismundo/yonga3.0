import { connect } from 'react-redux'
import { NotificationContainer } from 'react-notifications'

import DarkOverlay from './DarkOverlay'
import NavMenu from './NavMenu'
import Header from './Header'
import Footer from './Footer'

import UploadModal from '../components/UploadModal'
import ConfirmModal from '../components/ConfirmModal'

const Layout = ({ children }) => {
  return (
    <>
      <UploadModal />
      <ConfirmModal />
      <NotificationContainer />
      <DarkOverlay />
      <Header />

      <NavMenu />
      <div className='page-wrapper'>{children}</div>
      <Footer />
    </>
  )
}

const mapStateToProps = ({ ui }) => ({
  navMenuIsOpen: ui.navMenuIsOpen
})

export default connect(mapStateToProps)(Layout)
