import React, { useState } from 'react'
import { Container } from 'react-bootstrap';
import SearchBar from './SearchBar';
import InprogressTable from './InprogressTable';

const ProgressIframe = () => {
    const [beneficiaries, setBeneficiaries] = useState([
        {
            "id": 1,
            "verticalName": "BT",
            "fatherHusbandName": 'Yes',
            "village": 'Yes',
            "mandal": 'Yes',
            "district": 'Yes',
            "state": 'Yes',
            "aadhar": 'Yes',
            "surveyNo": 'Yes',
            "components": [
                {
                    "id": 2,
                    "componentName": "Enterprise",
                    "activities": [
                        {
                            "id": 3,
                            "activityName": "AIB",
                            "tasks": [
                                {
                                    "id": 4,
                                    "taskName": "VOICE",
                                    "typeOfUnit": "gm",
                                    "units": "10",
                                    "ratePerUnit": "800",
                                    "totalCost": "234",
                                    "beneficiaryContribution": "12",
                                    "grantAmount": "234",
                                    "yearOfSanction": "2009",
                                    "additionalRows": [
                                        {
                                            unitAchievement: '',
                                            remainingBalance: '',
                                            duration: '',
                                            payeeName: '',
                                            passbookCopy: ''
                                        }
                                    ]
                                },
                                {
                                    "id": 5,
                                    "taskName": "CV",
                                    "typeOfUnit": "gm",
                                    "units": "20",
                                    "ratePerUnit": "700",
                                    "totalCost": "234",
                                    "beneficiaryContribution": "12",
                                    "grantAmount": "234",
                                    "yearOfSanction": "2009",
                                    "additionalRows": [
                                        {
                                            unitAchievement: '',
                                            remainingBalance: '',
                                            duration: '',
                                            payeeName: '',
                                            passbookCopy: ''
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": 6,
                    "componentName": "Consumer",
                    "activities": [
                        {
                            "id": 7,
                            "activityName": "OFS",
                            "tasks": [
                                {
                                    "id": 8,
                                    "taskName": "Global",
                                    "typeOfUnit": "gm",
                                    "units": "96",
                                    "ratePerUnit": "89",
                                    "totalCost": "234",
                                    "beneficiaryContribution": "12",
                                    "grantAmount": "234",
                                    "yearOfSanction": "2009",
                                    "additionalRows": [
                                        {
                                            unitAchievement: '',
                                            remainingBalance: '',
                                            duration: '',
                                            payeeName: '',
                                            passbookCopy: ''
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ]);


    return (
        <Container>
            <SearchBar />
            <InprogressTable beneficiaries={beneficiaries} setBeneficiaries={setBeneficiaries} />
        </Container>
    )
}

export default ProgressIframe;
