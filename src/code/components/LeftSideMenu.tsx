import React from 'react';
import {Button, makeStyles} from '@material-ui/core'
import {Link} from 'react-router-dom'

import 'normalize.css'
import '../../styles/lsmenu.scss'

const useStyles = makeStyles({
    "ls-menu__button": {
        // marginBottom: 10,
        maxWidth: 280,
        minWidth: 250,
        margin: "0px auto 10px auto",
        '&:nth-child(1)': {
            // marginTop: 30
        }
        // backgroundColor: '#A8DADC'
    },
    "link": {
        margin: '0 auto',
        '&:nth-child(1)': {
            marginTop: 30
        }
    }
})

export default function LeftSideMenu() {
    const styles = useStyles()
    return (
        <React.Fragment>
            <Link to="/" className={styles.link}>
                <Button variant="contained" className={styles["ls-menu__button"]}>
                    Main
                </Button>
            </Link>
            <Link to="/layoutmaker" className={styles.link}>
                <Button variant="contained" className={styles["ls-menu__button"]}>
                    LayoutMaker
                </Button>
            </Link>
            <Link to="/newlayout" className={styles.link}>
                <Button variant="contained" className={styles["ls-menu__button"]}>
                    New layout
                </Button>
            </Link>
            <Link to="/test" className={styles.link}>
                <Button variant="contained" className={styles["ls-menu__button"]}>
                    Tests
                </Button>
            </Link>
        </React.Fragment>
    )
}