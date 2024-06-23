import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AccountsService} from "../services/accounts.service";
import {catchError, Observable, throwError} from "rxjs";
import {AccountDetails} from "../model/account.model";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.css'
})
export class AccountsComponent implements OnInit{
  accountFormGroup! : FormGroup
  currentPage:number=0;
  pageSize:number=5;
  accountObservable!:Observable<AccountDetails>
  operationFormGroup!:FormGroup;
  errorMessage!:string;

  constructor(private fb:FormBuilder,private accountService:AccountsService,public authService:AuthService) {
  }
  ngOnInit(): void {
    this.accountFormGroup=this.fb.group({
      accountId:this.fb.control('')
    });
    this.operationFormGroup=this.fb.group({
      operationType:this.fb.control(null),
      amount : this.fb.control(0),
      description:this.fb.control(null),
      accountDestination:this.fb.control (null)
    })
  }

  handleSearchAccount() {
    let accountId:string=this.accountFormGroup.value.accountId;
this.accountObservable=this.accountService.getAccount(accountId,this.currentPage,this.pageSize).pipe(
  catchError(err=>{
    this.errorMessage=err.message;
    return throwError(err);
  })
);
  }

  gotoPage(page: number) {
    this.currentPage=page;
    this.handleSearchAccount();
  }

  handleAccountOperation() {
   let accountID:string=this.accountFormGroup.value.accountId;
   let operationType=this.operationFormGroup.value.operationType;
   let amount : number=this.operationFormGroup.value.amount;
   let description:string=this.operationFormGroup.value.description;
   let accountDestination:string=this.operationFormGroup.value.accountDestination;
   if (operationType=='DEBIT'){
      this.accountService.debit(accountID,amount,description).subscribe({
        next:()=>{
          alert("Success Debit");
          this.operationFormGroup.reset();
          this.handleSearchAccount();
        },
        error:(err)=>{
          console.log(err);
        }
      });
   }
   else if (operationType=='CREDIT'){
     this.accountService.credit(accountID,amount,description).subscribe({
       next:()=>{
         alert("Success Credit");
         this.operationFormGroup.reset();
         this.handleSearchAccount();
       },
       error:(err)=>{
         console.log(err);
       }
     });
   }
   else if (operationType=='TRANSFER'){
     this.accountService.transfer(accountID,accountDestination,amount,description).subscribe({
       next:()=>{
         alert("Success Transfer");
         this.operationFormGroup.reset();
         this.handleSearchAccount();
       },
       error:(err)=>{
         console.log(err);
       }
     });
   }
  }
}
