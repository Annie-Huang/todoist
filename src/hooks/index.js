import { useState, useEffect } from 'react';
import moment from 'moment';
import { firebase } from "../firebase";
import { collatedTasksExist } from '../helpers';

export const useTasks = selectedProject => {
    const [tasks, setTasks] = useState([]);
    // users, setUsers
    // cats, setCats

    useEffect(() => {
        let unsubscribe = firebase
            .firestore()
            .collection('tasks')
            .where('userId', '==', 'aaaaa');


        // Give me the tasks for the selected project
        unsubscribe =
            selectedProject && !collatedTasksExist(selectedProject)
                ? (unsubscribe = unsubscribe.where('projectId', '==', selectedProject))         // if
                : selectedProject === 'TODAY'                                                                   // else if
                ? (unsubscribe = unsubscribe.where(
                    'date',
                    '==',
                    moment().format('DD/MM/YYYY')
                ))
                : selectedProject === 'INBOX' || selectedProject === 0                                          // else if
                    ? (unsubscribe = unsubscribe.where('date', '==', ''))
                    : unsubscribe;                                                                              // else

        unsubscribe = unsubscribe.onSnapshot(snapshot => {
            const newTasks = snapshot.docs.map(task => ({
                id: task.id,
                ...task.data(),
            }));

            setTasks(
                selectedProject === 'NEXT_7'
                    ? newTasks.filter(
                    task =>
                        moment(task.date, 'DD-MM-YYYY').diff(moment(), 'days') <= 7 &&
                        task.archived !== true
                    )
                    : newTasks.filter(task => task.archived !== true)
            );

        })

    }, [selectedProject]);
};
