import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {AccountDetails} from "../model/account.model";

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  backendhost:string="http://localhost:8085";
  constructor(private http:HttpClient) {}
    public getAccount(accountId:string,page:number,size:number){
      return this.http.get<AccountDetails>(this.backendhost+"/accounts/"+accountId+"/pageOperations?page="+page+"&size="+size);
    }
  public debit(accountId:string,amount:number,description : string ){
    let data={accountId:accountId,amount:amount,description:description}
    return this.http.post(this.backendhost+"/accounts/debit",data);
  }
  public credit(accountId:string,amount:number,description : string ){
    let data={accountId:accountId,amount:amount,description:description}
    return this.http.post(this.backendhost+"/accounts/credit",data);
  }
  public transfer(accountSource:string,accountDestination:string,amount: number,description : string ){
    let data={accountSource,accountDestination,amount,description}
    return this.http.post(this.backendhost+"/accounts/transfer",data);
  }
}
