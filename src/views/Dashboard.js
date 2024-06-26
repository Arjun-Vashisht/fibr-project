'use client'

import React, { useEffect, useState } from 'react'
import { app } from '../../firebase'
import { getDatabase, ref, get, remove } from "firebase/database"
import { useRouter } from 'next/navigation'
import styles from '../styles/dashboard.module.css'
import Link from 'next/link'


const Dashboard = () => {
    const [data, setData] = useState()
    const router = useRouter()

    useEffect(()=>{
        const fetchData = async () => {
            const db = getDatabase(app);
            const dbRef = ref(db, "nature/landing");
            try {
                const getData = await get(dbRef);
                const dataObj = getData.val()
                setData(dataObj)
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchData();
    },[])

    const deleteHandler = async (landingId) => {
        try {
            const db = getDatabase(app);
            const dbRef = ref(db, "nature/landing/" + landingId);
            await remove(dbRef);
            setData(prevData => {
                const updatedData = { ...prevData };
                delete updatedData[landingId];
                return updatedData;
            });
            alert("Item deleted successfully.");
        } catch (error) {
            console.error("Error deleting item:", error);
            setError(error);
        }
    }

    const updateHandler = (landingId) =>{
        router.push(`/update/${landingId}`)
    }


    return (
        data == undefined ? (data === null ? <div>No Landing Page</div> : <div>Loading...</div>) :
        <div>
            <div>
                <main className={styles.main}>
                    <div className={styles.cardContainer}>
                    {Object.entries(data).filter(([key, item]) => item.status === 'publish').map(([key, item], index)=>{
                        return(
                            <div key={index} className={styles.card}>
                                <Link href={`/${key}`}>
                                    <div>
                                        <div className={styles.cardImage}>
                                            <img src={item.imageUrl} alt="Landing Page 1"/>
                                        </div>
                                        <div className={styles.cardContent}>
                                            <h2 className={styles.cardTitle}>{item.title}</h2>
                                            <p className={styles.cardDescription}>{item.description}</p>
                                            <div style={{display:"flex", justifyContent:"space-between"}}>
                                                <p>Views: {item.views}</p>
                                                <p>Rating: {item.rating == 0 ? 0 : (item.rating/item.numberRating).toFixed(1)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                                <div className={styles.cardFooter}>
                                    <button onClick={()=>updateHandler(key)} className={styles.btn}>Update</button>
                                    <button onClick={()=>deleteHandler(key)} className={styles.dlBtn}>Delete</button>
                                </div>
                            </div>
                        )
                    })}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Dashboard