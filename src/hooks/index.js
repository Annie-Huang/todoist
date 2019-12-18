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

    }, [selectedProject]);
};
