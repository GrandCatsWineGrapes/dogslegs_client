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
            marginTop: 30
        }
        // backgroundColor: '#A8DADC'
    }
})

export default function LeftSideMenu() {
    const styles = useStyles()
    return (
        <React.Fragment>
            <Button variant="contained" className={styles["ls-menu__button"]}>
                <Link to="/" className="link">Главная</Link>
            </Button>
            <Button variant="contained" className={styles["ls-menu__button"]}>
                <Link to="/layoutmaker" className="link">LayoutMaker</Link>
            </Button>
            <Button variant="contained" className={styles["ls-menu__button"]}>
                <Link to="/newlayout" className="link">New layout</Link>
            </Button>
            <Button variant="contained" className={styles["ls-menu__button"]}>
                <Link to="/test" className="link">Tests</Link>
            </Button>
        </React.Fragment>
    )
}