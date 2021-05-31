import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import store from '../src/store/store'
import {PersistGate} from 'redux-persist/integration/react'
import {useStore} from "react-redux";
import Loader from "../src/components/Loader";

function MyApp(props) {
	const {Component, pageProps} = props;
	const store = useStore((state) => state);

	React.useEffect(() => {
		// Remove the server-side injected CSS.
		const jssStyles = document.querySelector('#jss-server-side');
		if (jssStyles) {
			jssStyles.parentElement.removeChild(jssStyles);
		}
	}, []);

	return (
		<React.Fragment>
			<Head>
				<title>My page</title>
				<meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
			</Head>
			<PersistGate persistor={store.__persistor} loading={<Loader/>}>
				<Component {...pageProps} />
			</PersistGate>
		</React.Fragment>
	);
}

// export default MyApp
export default store.withRedux(MyApp)
// export default wrapper.withRedux(MyApp)

MyApp.propTypes = {
	Component: PropTypes.elementType.isRequired,
	pageProps: PropTypes.object.isRequired,
};
