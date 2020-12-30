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
            <div className="logo">
                
            </div>
            <Link to="/" className={styles.link}>
                <Button variant="contained" className={styles["ls-menu__button"]}>
                    Home page
                </Button>
            </Link>
            <Link to="/layoutmaker" className={styles.link}>
                <Button variant="contained" className={styles["ls-menu__button"]}>
                    Form layout
                </Button>
            </Link>
            <Link to="/test" className={styles.link}>
                <Button variant="contained" className={styles["ls-menu__button"]}>
                    Create layout
                </Button>
            </Link>
            <Link to="/newlayout" className={styles.link}>
                <Button variant="contained" className={styles["ls-menu__button"]}>
                    Change layout
                </Button>
            </Link>
        </React.Fragment>
    )
}