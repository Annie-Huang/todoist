import { useState, useEffect } from 'react';
import moment from 'moment';
import { firebase } from "../firebase";
import { collatedTasksExist } from '../helpers';

export const useTasks = selectedProject => {
    const [tasks, setTasks] = useState([]);
    const [archivedTasks, setArchivedTasks] = useState([]);
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

            setArchivedTasks(newTasks.filter(task => task.archived !== false));
        });

        return () => unsubscribe();

    }, [selectedProject]);

    return {tasks, archivedTasks};
};

export const useProjects = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        firebase
            .firestore()
            .collection('projects')
            // The following two line cause the error of no index in firebase, and you will have to create the index. Page 20 in Firebase.docx
            .where('userId', '==', 'aaaaa')
            .orderBy('projectId')
            .get()  // Choose to get it once. Because getting project is less frequent than getting tasks.
            .then(snapshot => {
                const allProjects = snapshot.docs.map(project => ({
                    ...project.data(),
                    docId: project.id
                }));

                // Without the following the fetch will get into infinite loop as it's checking the if all projects' pointer
                // has change and will detect that it has. and then loop through again.
                if (JSON.stringify(allProjects) !== JSON.stringify(projects)) {
                    setProjects(allProjects);
                }
            });

    }, [projects]);

    return {projects, setProjects};
};
