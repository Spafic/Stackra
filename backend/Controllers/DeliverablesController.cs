using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Stackra.Backend.Models;
using Stackra.Backend.Repositories;

namespace Stackra.Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DeliverablesController : ControllerBase
{
    private readonly DeliverableRepository _repository;

    public DeliverablesController(DeliverableRepository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(_repository.GetAll());
    }

    [HttpGet("{jobId}/{number}")]
    public IActionResult Get(int jobId, int number)
    {
        var entity = _repository.GetById(jobId, number);
        if (entity == null) return NotFound();
        return Ok(entity);
    }

    [HttpPost]
    public IActionResult Create([FromBody] Deliverable entity)
    {
        _repository.Insert(entity);
        return Ok(entity);
    }

    [HttpPut("{jobId}/{number}")]
    public IActionResult Update(int jobId, int number, [FromBody] Deliverable entity)
    {
        entity.JobId = jobId;
        entity.Number = number;
        _repository.Update(entity);
        return Ok(entity);
    }

    [HttpDelete("{jobId}/{number}")]
    public IActionResult Delete(int jobId, int number)
    {
        _repository.Delete(jobId, number);
        return NoContent();
    }
}
